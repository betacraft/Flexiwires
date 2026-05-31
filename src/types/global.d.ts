/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    requestId: string;
    country?: string | undefined;
  }
}
