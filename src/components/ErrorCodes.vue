<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

interface NTStatusRecord {
  n: string;
  h: string;
  i: string;
  u: string;
}

const query = ref<string>("");
const ntstatus = ref<NTStatusRecord[]>([]);
const filtered = ref<NTStatusRecord[]>([]);
const n_filtered = ref<number>(0);

onMounted(async () => {
  ntstatus.value = (await import("../assets/data/win-ntstatus.json")).default;
});

watch(query, (q) => {
  const rows = ntstatus.value.filter((row) => {
    return (
      row.h.indexOf(q) !== -1 ||
      row.u.indexOf(q) !== -1 ||
      row.i.indexOf(q) !== -1 ||
      row.n.indexOf(q) !== -1
    );
  });
  n_filtered.value = rows.length;
  if (rows.length < 50) {
    filtered.value = rows;
  } else {
    filtered.value = [];
  }
});

const marked = (s: string): string => {
  if (filtered.value.length === 0) {
    return s;
  }
  const idx = s.indexOf(query.value);
  if (idx === -1) {
    return s;
  }
  const pre = s.substring(0, idx);
  const post = s.substring(idx + query.value.length);
  return `${pre}<mark>${query.value}</mark>${post}`;
};
</script>

<template>
  <div v-if="ntstatus && ntstatus.length > 0">
    <input v-model="query" placeholder="edit me" />
    <p v-if="query.length === 0">Loaded {{ ntstatus.length }} records</p>
    <p v-else>Matched {{ n_filtered }} of {{ ntstatus.length }} records</p>
    <table v-if="filtered && filtered.length > 0">
      <thead>
        <td>name</td>
        <td>u32 hex</td>
        <td>u32 dec</td>
        <td>i32 dec</td>
      </thead>
      <tr v-for="(item, i) in filtered" :key="i">
        <td v-html="marked(item.n)"></td>
        <td v-html="marked(item.h)"></td>
        <td v-html="marked(item.u)"></td>
        <td v-html="marked(item.i)"></td>
      </tr>
    </table>
  </div>
  <div v-else>Loading data...</div>
</template>
