<script>
  import { Input, Select } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let value = {}
  $: fieldsArray = Object.entries(value).map(([name, type]) => ({
    name,
    type,
  }))
  const typeOptions = [
    {
      label: "Text",
      value: "string",
    },
    {
      label: "Number",
      value: "number",
    },
    {
      label: "Boolean",
      value: "boolean",
    },
    {
      label: "DateTime",
      value: "datetime",
    },
  ]

  function addField() {
    const newValue = { ...value }
    newValue[""] = "string"
    dispatch("change", newValue)
  }

  function removeField(name) {
    const newValues = { ...value }
    delete newValues[name]
    dispatch("change", newValues)
  }

  const fieldNameChanged = originalName => e => {
    // reconstruct using fieldsArray, so field order is preserved
    let entries = [...fieldsArray]
    const newName = e.detail
    if (newName) {
      entries.find(f => f.name === originalName).name = newName
    } else {
      entries = entries.filter(f => f.name !== originalName)
    }
    value = entries.reduce((newVals, current) => {
      newVals[current.name] = current.type
      return newVals
    }, {})
    dispatch("change", value)
  }
</script>

<div class="root">
  <div class="add-field">
    <i class="ri-add-line" on:click={addField} />
  </div>
  <div class="spacer" />
  {#each fieldsArray as field}
    <div class="field">
      <Input
        value={field.name}
        secondary
        placeholder="Enter field name"
        on:change={fieldNameChanged(field.name)}
      />
      <Select
        value={field.type}
        on:change={e => {
          value[field.name] = e.target.value
          dispatch("change", value)
        }}
        options={typeOptions}
      />
      <i
        class="remove-field ri-delete-bin-line"
        on:click={() => removeField(field.name)}
      />
    </div>
  {/each}
</div>

<style>
  .root {
    position: relative;
    max-width: 100%;
    overflow-x: auto;
    /* so we can show the "+" button beside the "fields" label*/
    top: -26px;
  }

  .spacer {
    height: var(--spacing-s);
  }

  .field {
    max-width: 100%;
    background-color: var(--grey-2);
    margin-bottom: var(--spacing-m);
    border-style: solid;
    border-width: 1px;
    border-color: var(--grey-4);
    display: grid;
    /*grid-template-rows: auto auto;
    grid-template-columns: auto;*/
    position: relative;
    overflow: hidden;
  }

  .field :global(select) {
    padding: var(--spacing-xs) 2rem var(--spacing-m) var(--spacing-s) !important;
    font-size: var(--font-size-xs);
    color: var(--grey-7);
  }

  .field :global(.pointer) {
    padding-bottom: var(--spacing-m) !important;
    color: var(--grey-2);
  }

  .field :global(input) {
    padding: var(--spacing-m) var(--spacing-xl) var(--spacing-xs)
      var(--spacing-m);
    font-size: var(--font-size-s);
    font-weight: bold;
  }

  .remove-field {
    cursor: pointer;
    color: var(--grey-6);
    position: absolute;
    top: var(--spacing-m);
    right: 3px;
  }

  .remove-field:hover {
    color: var(--black);
  }

  .add-field {
    text-align: right;
  }

  .add-field > i {
    cursor: pointer;
  }
</style>
