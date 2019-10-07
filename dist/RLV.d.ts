/// <reference types="react" />
import { ViewStyle } from 'react-native';
import { RecyclerListViewProps } from 'recyclerlistview/dist/reactnative/core/RecyclerListView';
import { LayoutProviderTypes } from './LayoutUtil';
export declare type GenericObjectType<T = string> = {
    [k: string]: T;
};
export declare type RowRenderer = (type: string | number, data: any, index: number, extendedState?: object) => JSX.Element | JSX.Element[] | null;
interface RLVProps extends Omit<RecyclerListViewProps, 'dataProvider' | 'layoutProvider'> {
    rowRenderer: RowRenderer;
    getData: (skip: number, limit: number) => Promise<[]>;
    limit?: number;
    layoutProviderType?: LayoutProviderTypes;
    containerStyle?: ViewStyle;
    rlvStyle?: ViewStyle;
    rlvContentContainerStyle?: ViewStyle;
    cellHeight?: number;
    noDataMessageRenderer?: () => JSX.Element | JSX.Element[] | undefined;
    updateDataProvider?: (callback: (id: string, newUpdateData: GenericObjectType<any>) => void) => void;
    getDataById?: (callback: (id: string) => GenericObjectType<any>) => void;
    setNewData?: (callback: (newData: any[]) => void) => void;
}
export default function RLV(props: RLVProps): JSX.Element;
export {};
