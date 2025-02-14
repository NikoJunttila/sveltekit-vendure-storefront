<script lang="ts">
  import { countries, type Country } from "./countries";
  import * as m from '$lib/paraglide/messages.js';
  
  let inputValue = $state('');
  let filteredOptions: Country[] = $state([...countries]);
  let showDropdown = $state(false);
  let currentFocus = $state(-1);
  interface Props {
		selectedCountryCode: string;
	}
  let {selectedCountryCode} : Props = $props()

function handleFocus() {
    showDropdown = true;
  }

  function handleBlur(e: FocusEvent) {
    setTimeout(() => {
      showDropdown = false;
    }, 200);
  }
  
  function handleClick(option: Country) {
    console.log(option)
    inputValue = option.name;
    selectedCountryCode = option.code;
    showDropdown = false;
  }
  
  function handleInput() {
    currentFocus = -1;
    filteredOptions = countries.filter(country =>
      country.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    // Clear the selected code if input is cleared
    if (!inputValue) {
      selectedCountryCode = '';
    }
    showDropdown = true;
  }
  
  function handleKeyDown(e: KeyboardEvent) {
    if (!showDropdown) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentFocus = (currentFocus + 1) % filteredOptions.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentFocus = (currentFocus - 1 + filteredOptions.length) % filteredOptions.length;
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (currentFocus > -1) {
        handleClick(filteredOptions[currentFocus]);
      }
    } else if (e.key === "Escape") {
      showDropdown = false;
    }
  }
  $effect(() => {
    if (selectedCountryCode && !inputValue) {
      const country = countries.find(c => c.code === selectedCountryCode);
      if (country) {
        inputValue = country.name;
      }
    }
  })
</script>

<div class="relative w-full">
  <fieldset class="w-full">
    <label for="countries">{m.country()}*</label>
    <input
      class="w-full p-2 border rounded"
      class:rounded-b-none={showDropdown && filteredOptions.length > 0}
      bind:value={inputValue}
      onfocus={handleFocus}
      onblur={handleBlur}
      oninput={handleInput}
      onkeydown={handleKeyDown}
      autocomplete="off"
      aria-expanded={showDropdown}
      aria-autocomplete="list"
      aria-controls="countries-list"
      role="combobox"
      id="countries"
      name="countries"
      placeholder={m.select_country()}
    />
    
    {#if showDropdown && filteredOptions.length > 0}
      <div 
        id="countries-list"
        class="dropdown absolute w-full border-x border-b rounded-b bg-white z-10"
        role="listbox"
      >
        {#each filteredOptions as country, i}
          <div
            class="option"
            class:active={i === currentFocus}
            role="option"
            aria-selected={i === currentFocus}
            onmousedown={() => handleClick(country)}
            tabindex=0
          >
            {country.name} ({country.code})
          </div>
        {/each}
      </div>
    {/if}
  </fieldset>
</div>

<style>
  .dropdown {
    max-height: 150px;
    overflow-y: auto;
  }
  
  .option {
    padding: 8px;
    cursor: pointer;
  }
  
  .option:hover {
    background-color: #f3f4f6;
  }
  
  .option.active {
    background-color: #e5e7eb;
  }
</style>