<script lang="ts">
    import { getContextClient } from '@urql/svelte';
    import { SetOrderCustomFields } from '$lib/vendure';
    import * as m from '$lib/paraglide/messages.js';

    // Get the GraphQL client
    const client = getContextClient();
    
    interface WeekObject {
        days: Day[];
    }

    interface Day {
        day: string;
        date: string;
        slots: TimeSlot[];
        fullDate: Date;
    }

    interface TimeSlot {
        time: string;
        ordersAmount: number;
        maxOrders: number;
    }

	let { valid = $bindable() } = $props();
    // Using Svelte 5 $state for reactive variables
    let week = $state<WeekObject>({ days: [] });
    let selectedSlot = $state<{ display: string; timestamp: number } | null>(null);
    let closeDelivery = $state(false);
    let information = $state('');
    let noiseLevel = $state<string>('Normaali');
    let weekOffset = $state(0); // Added week offset
    
    // Function to get next 7 days with offset
    function getNext7Days(offset: number) {
        const days = [];
        const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
        
        for (let i = 0; i <= 6; i++) {
            const date = new Date();
            date.setDate(date.getDate() + offset + i);
            
            const formattedDate = `${date.getDate()}.${date.getMonth() + 1}`;
            
            days.push({
                day: dayNames[date.getDay()],
                date: formattedDate,
                fullDate: new Date(date),
                slots: [],
            });
        }
        
        return days;
    }
    
    // Function to generate hourly time slots
    function generateHourlySlots() {
        const slots = [];
        
        for (let hour = 10; hour <= 16; hour++) {
            slots.push({
                time: `${hour}:00-${hour + 1}:00`,
                ordersAmount: 0,
                maxOrders: 3
            });
        }
        
        return slots;
    }

    // Generate week based on weekOffset
    $effect(() => {
        const days = getNext7Days(weekOffset);
        const hourlySlots = generateHourlySlots();
        
        days.forEach(day => {
            //@ts-ignore
            day.slots = [...hourlySlots];
        });
        
        week = { days };
    });

    // Functions to handle user interactions
    async function selectTimeSlot(day: string, date: string, fullDate: Date, time: string) {
        const [startTime] = time.split('-');
        const [hours, minutes] = startTime.split(':');
        const slotDate = new Date(fullDate);
        slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        selectedSlot = {
            display: `${day} (${date}) ${time}`,
            timestamp: slotDate.getTime(),
        };
        
        localStorage.setItem('delivery', `Kotiin kuljetus ${day} (${date}) ${time}`);

        const updatedCustomFields = {
            dateString: selectedSlot.display,
            dateTime: new Date(selectedSlot.timestamp),
            ToimitusInfo: information,
        };
        
        try {
            await client
                .mutation(SetOrderCustomFields, {
                    input: {
                        customFields: updatedCustomFields
                    }
                })
                .toPromise();
            valid = true
        } catch (error) {
            console.log('error: ', error);
        }
    }
    // Debounce function
    function debounce(func: Function, delay: number) {
        let timer: number | undefined;
        return (...args: any[]) => {
            clearTimeout(timer);
            //@ts-ignore
            timer = setTimeout(() => func(...args), delay);
        };
    }

    // Original updateOrderInfo function
    async function updateOrderInfo() {
        const finalInfo = information
            ? `${noiseLevel}: ${information}`
            : noiseLevel;
        console.log(finalInfo);
        const updatedCustomFields = {
            ToimitusInfo: finalInfo, // Updated to use finalInfo
        };
        try {
            await client
                .mutation(SetOrderCustomFields, {
                    input: {
                        customFields: updatedCustomFields
                    }
                })
                .toPromise();
        } catch (error) {
            console.log('error: ', error);
        }
    }

    // Debounced version of updateOrderInfo
    const debouncedUpdateOrderInfo = debounce(updateOrderInfo, 500); // 500ms delay

    // Function to update noise level and trigger debounced update
    async function updateNoiseLevel(newNoiseLevel: string) {
        noiseLevel = newNoiseLevel;
        debouncedUpdateOrderInfo();
    }
</script>

<div>
    <!-- Delivery Info Header -->
    <div class="w-full py-4 text-lg font-semibold text-gray-700">
        {m.deliveryInfo()}
    </div>

    <!-- Week Navigation -->
    {#if week.days.length >= 7}
      <div class="flex justify-between items-center mb-4">
        <button 
          class="p-2 bg-gray-200 rounded disabled:opacity-50" 
          disabled={weekOffset === 0} 
          onclick={() => { if (weekOffset >= 7) weekOffset -= 7; }}
        >
          {m.prevweek()}
        </button>
        <span class="text-lg font-semibold">
          Viikko {week.days[0].date} - {week.days[6].date}
        </span>
        <button 
          class="p-2 bg-gray-200 rounded" 
          onclick={() => { weekOffset += 7; }}
        >
          {m.nextweek()}
        </button>
      </div>
    {/if}

    <!-- Grid of Days -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {#each week.days as day}
            <div class="flex flex-col border rounded-lg p-4 bg-white shadow-md">
                <div class="border-b border-gray-300 mb-3 pb-2">
                    <span class="font-bold text-lg text-gray-800">{day.day}</span>
                    <br />
                    <span class="text-sm text-gray-600">{day.date}</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    {#each day.slots as slot}
                        <button
                            class="p-2 text-base font-medium bg-gray-100 rounded hover:bg-blue-600 hover:text-white transition-colors"
                            class:!bg-blue-700={selectedSlot?.display === `${day.day} (${day.date}) ${slot.time}`}
                            class:text-white={selectedSlot?.display === `${day.day} (${day.date}) ${slot.time}`}
                            onclick={() => selectTimeSlot(day.day, day.date, day.fullDate, slot.time)}
                        >
                            {slot.time}
                        </button>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    <!-- Selected Slot or Prompt -->
    {#if selectedSlot}
        <div class="mt-6 p-3 bg-green-100 border border-green-300 rounded-lg">
            <span class="font-bold text-green-800">{m.selectedTime()}:</span>
            <span class="text-green-700">{selectedSlot.display}</span>
        </div>
    {:else}
        <div class="mt-6 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 font-bold text-xl">
            {m.selectDeliveryTime()}
        </div>
    {/if}

    <!-- Noise Level Selection -->
    <div class="mt-6">
        <p class="text-gray-700 mb-2 font-medium">{m.deliveryInstructions()}</p>
        <div class="flex flex-wrap gap-4">
            <label class="flex items-center">
                <input
                    type="radio"
                    name="noiseLevel"
                    value="Normaali"
                    checked={noiseLevel === 'Normaali'}
                    onclick={() => updateNoiseLevel('Normaali')}
                    class="form-radio h-5 w-5 text-blue-600"
                />
                <span class="ml-2 text-gray-700">{m.normal()}</span>
            </label>
            <label class="flex items-center">
                <input
                    type="radio"
                    name="noiseLevel"
                    value="Hiljainen"
                    checked={noiseLevel === 'Hiljainen'}
                    onclick={() => updateNoiseLevel('Hiljainen')}
                    class="form-radio h-5 w-5 text-blue-600"
                />
                <span class="ml-2 text-gray-700">{m.quiet()}</span>
            </label>
            <label class="flex items-center">
                <input
                    type="radio"
                    name="noiseLevel"
                    value="Oven taakse"
                    checked={noiseLevel === 'Oven taakse'}
                    onclick={() => updateNoiseLevel('Oven taakse')}
                    class="form-radio h-5 w-5 text-blue-600"
                />
                <span class="ml-2 text-gray-700">{m.behindDoor()}</span>
            </label>
        </div>
    </div>

    <!-- Delivery Instructions Input -->
    <div class="mt-4">
        <label for="deliveryInfo" class="block text-gray-700 font-medium mb-1">
            {m.driverInfo()}
        </label>
        <input
            id="deliveryInfo"
            type="text"
            bind:value={information}
            oninput={debouncedUpdateOrderInfo}
            class="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={m.driverInfo()}
        />
    </div>
</div>