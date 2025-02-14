<script lang="ts">
  import countries from "./countries";
  import * as m from '$lib/paraglide/messages.js';
  
  interface Props {
    selectedCountryCode: string;
    onError?: (error: string) => void;
  }
  
  // State management
  let inputValue = $state('');
  let filteredOptions = $state<Country[]>([]);
  let showDropdown = $state(false);
  let currentFocus = $state(-1);
  let error = $state('');
  let isLoading = $state(false);
  let isTouched = $state(false);

  type Country = {
  name:string;
  code:string;
  }

  let { 
    selectedCountryCode = $bindable("FI"),
    onError = (error: string) => console.error(error) 
  } : Props = $props();
  
  // Validation functions
  function validateInput(value: string): string {
    if (isTouched && !value) {
      return m.country_required();
    }
    return '';
  }
  
  // Event handlers
  function handleFocus() {
    showDropdown = true;
    isTouched = true;
    // Show all countries when input is focused and empty
    if (!inputValue) {
      filteredOptions = [...countries];
    }
  }
  
  function handleBlur(e: FocusEvent) {
    setTimeout(() => {
      showDropdown = false;
      // Validate on blur
      error = validateInput(inputValue);
      if (error) {
        onError(error);
      }
      
      // Reset input if no valid country is selected
      if (inputValue && !countries.some(c => c.name.toLowerCase() === inputValue.toLowerCase())) {
        inputValue = '';
        selectedCountryCode = '';
        error = m.invalid_country();
        onError(error);
      }
    }, 200);
  }
  
  function handleClick(option: Country) {
    try {
      inputValue = option.name;
      selectedCountryCode = option.code;
      showDropdown = false;
      error = '';
    } catch (err) {
      error = m.selection_error();
      onError(error);
    }
  }
  
  function handleInput() {
    try {
      isLoading = true;
      currentFocus = -1;
      
      // Clear everything if input is empty
      if (!inputValue) {
        resetState();
        return;
      }
  
      // Filter countries
      filteredOptions = countries.filter(country => 
        country.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        country.code.toLowerCase().includes(inputValue.toLowerCase())
      );
  
      error = validateInput(inputValue);
      if (error) {
        onError(error);
      }
  
      showDropdown = true;
    } catch (err) {
      error = m.filter_error();
      onError(error);
    } finally {
      isLoading = false;
    }
  }
  
  function handleKeyDown(e: KeyboardEvent) {
    if (!showDropdown) return;
    
    try {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          currentFocus = (currentFocus + 1) % filteredOptions.length;
          break;
        case "ArrowUp":
          e.preventDefault();
          currentFocus = (currentFocus - 1 + filteredOptions.length) % filteredOptions.length;
          break;
        case "Enter":
          e.preventDefault();
          if (currentFocus > -1) {
            handleClick(filteredOptions[currentFocus]);
          }
          break;
        case "Escape":
          e.preventDefault();
          showDropdown = false;
          break;
        case "Tab":
          showDropdown = false;
          break;
      }
    } catch (err) {
      error = m.navigation_error();
      onError(error);
    }
  }
  
  // Helper functions
  function resetState() {
    selectedCountryCode = '';
    filteredOptions = [...countries];
    error = '';
    showDropdown = true;
  }
  
  // Effects
  $effect(() => {
    if (selectedCountryCode && !inputValue) {
      const country = countries.find(c => c.code === selectedCountryCode);
      if (country) {
        inputValue = country.name;
        error = '';
      } else {
        error = m.invalid_country_code();
        onError(error);
      }
    }
  });
  </script>
  
  <div class="relative w-full">
    <fieldset class="w-full">
      <label for="countries" class="block mb-2">
        {m.country()}*
      </label>
      
      <div class="relative">
        <input
          autocomplete="off"
          class="w-full p-2 border rounded transition-colors duration-200"
          class:border-red-500={error}
          class:rounded-b-none={showDropdown && filteredOptions.length > 0}
          bind:value={inputValue}
          onfocus={handleFocus}
          onblur={handleBlur}
          oninput={handleInput}
          onkeydown={handleKeyDown}
          aria-expanded={showDropdown}
          aria-controls="countries-list"
          aria-invalid={!!error}
          aria-describedby={error ? 'error-message' : undefined}
          role="combobox"
          id="countries"
          name="countries"
          placeholder={m.select_country()}
        />
        
        {#if isLoading}
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
            <span class="loading">...</span>
          </div>
        {/if}
      </div>
  
      {#if error}
        <p id="error-message" class="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      {/if}
  
      {#if showDropdown && filteredOptions.length > 0}
        <div
          id="countries-list"
          class="dropdown absolute w-full border-x border-b rounded-b bg-white z-10 shadow-lg"
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
              <span class="font-medium">{country.name}</span>
              <span class="text-gray-500 ml-2">({country.code})</span>
            </div>
          {/each}
        </div>
      {:else if showDropdown && inputValue}
        <div class="absolute w-full border-x border-b rounded-b bg-white z-10 p-3 text-gray-500">
          {m.no_countries_found()}
        </div>
      {/if}
    </fieldset>
  </div>
  
  <style>
  .dropdown {
    max-height: 250px;
    overflow-y: auto;
    scrollbar-width: thin;
  }
  
  .option {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .option:hover {
    background-color: #f3f4f6;
  }
  
  .option.active {
    background-color: #e5e7eb;
  }
  
  .loading {
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  </style>