import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import ErrorCodes from "../ErrorCodes.vue";

describe("ErrorCodes", () => {
  it("renders properly", () => {
    const wrapper = mount(ErrorCodes, { props: { msg: "Hello Vitest" } });
    expect(wrapper.text()).toContain("Hello Vitest");
  });
});
