/// <reference types="react" />
import { ViewStyle } from 'react-native';
import { LayoutProviderTypes } from './LayoutUtil';
export declare type GenericObjectType<T = string> = {
    [k: string]: T;
};
export declare type RowRenderer = (type: string | number, data: any, index: number, extendedState?: object) => JSX.Element | JSX.Element[] | null;
interface RLVProps {
    rowRenderer: RowRenderer;
    getData: (skip: number, limit: number) => Promise<[]>;
    limit?: number;
    layoutProviderType?: LayoutProviderTypes;
    containerStyle?: ViewStyle;
    rlvStyle?: ViewStyle;
    rlvContentContainerStyle?: ViewStyle;
    cellHeight?: number;
    forceNonDeterministicRendering?: boolean;
    noDataMessageRenderer?: () => JSX.Element | JSX.Element[] | undefined;
    updateDataProvider?: (callback: (id: string, newUpdateData: GenericObjectType<any>) => void) => void;
    getDataById?: (callback: (id: string) => {}) => void;
    setNewData?: (callback: (newData: any[]) => void) => void;
}
export default function RLV({ rowRenderer, getData, limit, layoutProviderType, containerStyle, rlvStyle, rlvContentContainerStyle, cellHeight, forceNonDeterministicRendering, noDataMessageRenderer, updateDataProvider, // update existing data
getDataById, setNewData, }: RLVProps): JSX.Element;
export {};
