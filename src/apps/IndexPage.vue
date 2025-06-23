<!-- <template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Todo, Meta } from '@components/models';
import ExampleComponent from '@components/ExampleComponent.vue';

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1',
  },
  {
    id: 2,
    content: 'ct2',
  },
  {
    id: 3,
    content: 'ct3',
  },
  {
    id: 4,
    content: 'ct4',
  },
  {
    id: 5,
    content: 'ct5',
  },
]);

const meta = ref<Meta>({
  totalCount: 1200,
});
</script> -->
<template>
  <q-page>
    <div class="q-pa-md q-gutter-md">
      <div class="q-mb-md">
        <q-select filled v-model="anchor" label="Anchor" :options="positionOptions" dense />
        <q-select filled v-model="self" label="Self" :options="positionOptions" dense />
        <q-input filled v-model.number="offsetX" label="Offset X" type="number" dense />
        <q-input filled v-model.number="offsetY" label="Offset Y" type="number" dense />
      </div>
      <q-btn label="Mostrar popup" color="primary">
        <q-popup-proxy
          :anchor="anchor"
          :self="self"
          :offset="[offsetX, offsetY]"
          transition-show="scale"
          transition-hide="scale"
          class="bg-grey-2 text-black shadow-2 q-pa-md border-test"
        >
          <div>¡Soy un popup!</div>
          <div class="text-caption">anchor: {{ anchor }} / self: {{ self }}</div>
          <div class="text-caption">offset: [{{ offsetX }}, {{ offsetY }}]</div>
        </q-popup-proxy>
      </q-btn>
      <smart-filter-slide />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import SmartFilterSlide from '@components/SmartFilterSlide.vue';

const anchor = ref('bottom left');
const self = ref('top left');
const offsetX = ref(0);
const offsetY = ref(10);

const positionOptions = [
  'top left',
  'top middle',
  'top right',
  'center left',
  'center middle',
  'center right',
  'bottom left',
  'bottom middle',
  'bottom right',
];
</script>

<style scoped>
.border-test {
  border: 1px dashed #999;
}
</style>
