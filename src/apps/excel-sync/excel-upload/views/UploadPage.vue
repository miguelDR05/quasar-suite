<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">Subir archivo Excel</div>

      <q-file
        v-model="file"
        label="Selecciona un archivo Excel"
        filled
        use-chips
        accept=".xlsx,.xls"
      />

      <q-btn
        label="Subir archivo"
        color="primary"
        class="q-mt-md"
        :disable="!file"
        @click="upload"
      />
    </q-card>

    <div v-if="Object.keys(preview).length" class="q-mt-xl">
      <div class="text-h6">Previsualización por hoja</div>

      <q-tabs v-model="selectedSheet" dense class="text-primary q-mt-md">
        <q-tab
          v-for="(rows, sheetName) in preview"
          :key="sheetName"
          :name="sheetName"
          :label="sheetName"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="selectedSheet" animated>
        <q-tab-panel v-for="(rows, sheetName) in preview" :key="sheetName" :name="sheetName">
          <q-table :rows="rows" :columns="getColumns(rows)" dense flat bordered row-key="__index" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import { QTableProps } from 'quasar';

const file = ref<File | null>(null);
const preview = ref<Record<string, any[]>>({});
const selectedSheet = ref<string>('');

const upload = async () => {
  if (!file.value) return;

  const formData = new FormData();
  formData.append('file', file.value);

  try {
    const { data } = await axios.post('http://127.0.0.1:8001/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    preview.value = data.sheets;
    selectedSheet.value = Object.keys(data.sheets)[0] || '';
  } catch (err) {
    console.error('Error al subir:', err);
  }
};

const getColumns = (rows: any[]): QTableProps['columns'] => {
  if (!rows || rows.length === 0) return [];

  return Object.keys(rows[0]).map((key) => ({
    name: key,
    label: key.toUpperCase(),
    field: key,
    align: 'left',
  }));
};
</script>
