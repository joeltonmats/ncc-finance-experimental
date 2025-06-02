// ErrorSection.stories.tsx
import ErrorSection from "./ErrorSection";

import type { Meta, StoryObj } from "@storybook/react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { NextRouter } from "next/router";

const mockRouter: Partial<NextRouter> = {
  pathname: "/",
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  prefetch: () => Promise.resolve(),
};

const meta: Meta<typeof ErrorSection> = {
  title: "Home/ErrorSection",
  component: ErrorSection,
  decorators: [
    (Story) => (
      <RouterContext.Provider value={mockRouter as NextRouter}>
        <Story />
      </RouterContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ErrorSection>;

export const Default: Story = {};
