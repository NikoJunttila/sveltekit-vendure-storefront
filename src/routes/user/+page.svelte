<script lang="ts">
    import { userStore } from "$src/lib/stores";
    import { formatCurrency } from "$src/lib/utils";
    
    // Using $derived with type checking
    const user = $derived($userStore)
    const isLoading = $derived(!user || Object.keys(user).length === 0)
    
    // Format date
    const formatDate = (dateString: string) => {
      if (!dateString) return 'In Progress';
      return new Date(dateString).toLocaleDateString('fi-FI');
    };
    </script>
    
    {#if isLoading}
      <div class="flex justify-center items-center min-h-screen">
        <div class="animate-pulse text-xl">Loading...</div>
      </div>
    {:else}
      <div class="max-w-4xl mx-auto p-6 space-y-8">
        <!-- User Info Section -->
        <div class="rounded-lg shadow-md p-6 bg-primary-700">
          <h1 class="text-3xl font-bold mb-6">Customer Profile</h1>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h2 class="text-xl font-semibold mb-4">Personal Information</h2>
              <div class="space-y-2">
                <p><span class="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                <p><span class="font-medium">Email:</span> {user.emailAddress}</p>
                <p><span class="font-medium">Phone:</span> {user.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
    
            {#if user.addresses?.length > 0}
              <div>
                <h2 class="text-xl font-semibold mb-4">Default Address</h2>
                {#each user.addresses.filter(addr => addr.defaultShippingAddress) as address}
                  <div class="space-y-1">
                    <p>{address.fullName}</p>
                    <p>{address.streetLine1}</p>
                    {#if address.streetLine2}<p>{address.streetLine2}</p>{/if}
                    <p>{address.postalCode} {address.city}</p>
                    <p>{address.country.name}</p>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
    
        <!-- Orders Section -->
        {#if user.orders}
          <div class="rounded-lg shadow-md p-6 bg-primary-700">
            <h2 class="text-2xl font-bold mb-6">Order History ({user.orders.totalItems} orders)</h2>
            
            <div class="space-y-6">
              {#each user.orders.items as order}
                <div class="border rounded-lg p-4 bg-primary-400  transition-colors">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <p class="font-medium">Order #{order.code}</p>
                      <p class="text-sm ">
                        {formatDate(order.orderPlacedAt)}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold">{formatCurrency(order.totalWithTax)}€</p>
                      <span class="inline-block px-2 py-1 text-sm rounded-full
                        {order.state === 'PaymentAuthorized' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                        {order.state}
                      </span>
                    </div>
                  </div>
                  
                  <div class="space-y-2">
                    {#each order.lines as line}
                      <div class="text-sm ">
                        <p>{line.productVariant.name} amount:{line.quantity} {formatCurrency(line.productVariant.priceWithTax)}€</p>
                        <p class="text-xs">SKU: {line.productVariant.sku}</p>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}