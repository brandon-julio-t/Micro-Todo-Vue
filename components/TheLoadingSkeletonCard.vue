<template>
  <v-row>
    <v-col v-for="i in Array(6)" :key="i" cols="12" lg="2" sm="4">
      <VSkeletonLoader type="card@3" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TheLoadingSkeletonCard'
}
</script>
