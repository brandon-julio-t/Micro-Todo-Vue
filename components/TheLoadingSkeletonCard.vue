<template>
  <section>
    <div>
      <VSkeletonLoader type="text" />

      <v-row>
        <v-col v-for="i in Array(6)" :key="i" cols="12" lg="2" sm="4">
          <VSkeletonLoader type="card@2" />
        </v-col>
      </v-row>
    </div>
    <div>
      <VSkeletonLoader type="text" />

      <v-row>
        <v-col v-for="i in Array(6)" :key="i" cols="12" lg="2" sm="4">
          <VSkeletonLoader type="card@2" />
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TheLoadingSkeletonCard'
}
</script>
