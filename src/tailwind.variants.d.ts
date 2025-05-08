declare module 'tailwind-variants' {
  export type TVReturnType = string & { toString: () => string };
  export type TVConfig = Record<string, Record<string, string>>;
  export type TVVariantProps<T extends (props: any) => any> = Parameters<T>[0];

  export function tv(options: {
    base?: string;
    variants?: Record<string, Record<string, string>>;
    defaultVariants?: Record<string, string>;
    compoundVariants?: Array<{ 
      class?: string; 
      className?: string; 
      [key: string]: any;
    }>;
  }): (props?: Record<string, any>) => TVReturnType;
}