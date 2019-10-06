import { LayoutProvider } from 'recyclerlistview';
export declare function getWindowWidth(): number;
export declare enum LayoutProviderTypes {
    'AUTO_ALIGN' = 0,
    'TWO_COLUMN' = 1,
    'ONE_COLUMN' = 2
}
export declare function getLayoutProvider(layoutType: LayoutProviderTypes | undefined, height?: number): LayoutProvider;
