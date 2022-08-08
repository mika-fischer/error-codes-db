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
    <input v-model="query" placeholder="search for error codes" />
    <p v-if="query.length === 0">Loaded {{ ntstatus.length }} records</p>
    <p v-else>Matched {{ n_filtered }} of {{ ntstatus.length }} records</p>
    <table v-if="filtered && filtered.length > 0">
      <thead>
        <td class="error-name-header">name</td>
        <td class="error-code-header">code</td>
      </thead>
      <tr v-for="(item, i) in filtered" :key="i">
        <td class="error-name" v-html="marked(item.n)"></td>
        <td class="error-code">
          <div class="error-code-hex" v-html="marked(item.h)"></div>
          <div class="error-code-u32" v-html="marked(item.u)"></div>
          <div class="error-code-i32" v-html="marked(item.i)"></div>
        </td>
      </tr>
    </table>
  </div>
  <div v-else>Loading data...</div>
</template>

<style scoped>
.error-name-header {
  text-align: left;
}

.error-code-header {
  text-align: right;
}

.error-name {
  text-align: left;
  font-family: monospace;
}

.error-code {
  text-align: right;
  font-family: monospace;
}
</style>
