import { mkdir, writeFile } from "node:fs/promises";
import { fetch } from "undici";
import { toI32, toU32 } from "./utils.mjs";

const ntstatusURL =
  "https://raw.githubusercontent.com/tpn/winsdk-10/master/Include/10.0.14393.0/shared/ntstatus.h";

async function main() {
  const res = await fetch(ntstatusURL);
  const data = await res.text();
  const result = data
    .split(/\r?\n/)
    .filter((l) => /\(NTSTATUS\)0x/.test(l))
    .map((l) => {
      const [, n, val] = l.split(/\s+/);
      const h = val.substring(13, 21);
      const hexVal = parseInt(h, 16);
      const u = toU32(hexVal);
      const i = toI32(hexVal);
      return { n, h, u, i };
    });

  const destination = new URL(
    "../src/assets/data/win-ntstatus.json",
    import.meta.url
  );
  const destinationDir = new URL(".", destination);
  await mkdir(destinationDir, { recursive: true });
  await writeFile(destination, JSON.stringify(result));
}

main();
