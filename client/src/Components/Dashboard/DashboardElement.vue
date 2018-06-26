<template>
  <div>
    <b-button :class="'btn btn-' + element.color" :title="element.title" @click.prevent="$emit('change-type', element.name)">
      <icon :name="element.icon"></icon> <span class="badge badge-light">{{element.value}}</span>
    </b-button>
  </div>
</template>

<script>
export default {
  props: ['element']
}
</script>
