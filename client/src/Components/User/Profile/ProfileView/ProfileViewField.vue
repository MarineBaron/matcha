<template>
<div>
     <p style="text-align:justify;"><span class="font-weight-bold">{{field.name}} : </span>{{field.value}}</p>
     </div>
</template>
<script>
  export default {
    props: {
      field: {
        type: Object
      }
    },
  }
</script>