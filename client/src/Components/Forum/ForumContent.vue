<template>
  <div><div v-for="m in messages"><span>{{m.titre}} - {{m.message}}</span></div></div>
</template>

<script>
const messages = [
  {titre: 'blbla', message: 'toto'},
  {titre: 'blbla', message: 'toto'},
  {titre: 'blbla', message: 'toto'},
  {titre: 'blbla', message: 'toto'},
  {titre: 'blbla', message: 'toto'},
]

export default {
  data() {
    return {
      messages
    }
  },
}
</script>
