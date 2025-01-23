<script>
    // @ts-nocheck
        import { flip } from "svelte/animate";
        import { fly } from "svelte/transition";
        import { toast } from "../toast.svelte";
    
        const themes = {
            error: "#E26D69",
            success: "#84C991",
            warning: "#f0ad4e",
            info: "#5bc0de",
            default: "#aaaaaa",
        };
    </script>
    <div class="notifications">
        {#each toast.notifs as notification (notification.id)}
            <div
                animate:flip
                class="toast2 text-center py-4"
                style="background: {themes[notification.type]};"
                transition:fly={{ y: 30 }}>
                <div class="content">{notification.message}</div>
            </div>
        {/each}
    </div>
    <style>
        .notifications {
            position: fixed;
            top: 5%;
            left: 0;
            right: 0;
            margin: 0 auto;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            pointer-events: none;
    
        }
    
        .toast2 {
            flex: 0 0 auto;
            border-radius: 40px;
            width: 250px;
            margin-bottom: 10px;
        }
    
        .content {
            padding: 10px;
            display: block;
            color: white;
            font-weight: 700;
            font-size: 1.1rem;
        }
    </style>