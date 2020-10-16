import pptr, { Page } from 'puppeteer-core';

declare type ResourceFilterCtx = {
    url: string;
    type: string;
};
declare type TakiOptions = {
    url: string;
    manually?: string | boolean;
    wait?: string | number;
    onBeforeRequest?: (url: string) => void;
    onAfterRequest?: (url: string) => void;
    onCreatedPage?: (page: Page) => void | Promise<void>;
    onBeforeClosingPage?: (page: Page) => void | Promise<void>;
    minify?: boolean;
    resourceFilter?: (ctx: ResourceFilterCtx) => boolean;
    blockCrossOrigin?: boolean;
    chromePath?: string;
};
declare function request(options: TakiOptions): Promise<string>;
declare function request(options: TakiOptions[]): Promise<string[]>;
declare function cleanup(): Promise<void>;
declare function getBrowser(): pptr.Browser | undefined;

export { ResourceFilterCtx, TakiOptions, cleanup, getBrowser, request };
