import React, { useState, useLayoutEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

// @ts-ignore
import { ComponentDidAppearEvent } from 'react-native-navigation';
import { DataProvider, RecyclerListView, LayoutProvider } from 'recyclerlistview';
import { RecyclerListViewProps } from 'recyclerlistview/dist/reactnative/core/RecyclerListView';
import { getLayoutProvider, LayoutProviderTypes } from './LayoutUtil';

let useNavigationComponentDidAppear: (handler: (event: any) => void, componentId?: string | undefined) => void;

try {
  const { Navigation } = require('react-native-navigation');
  useNavigationComponentDidAppear = function useNavigationComponentDidAppearFn(
    handler: (event: ComponentDidAppearEvent) => void,
    componentId?: string,
  ) {
    useLayoutEffect(() => {
      const subscription = Navigation.events().registerComponentDidAppearListener((event: ComponentDidAppearEvent) => {
        const equalComponentId = event.componentId === componentId;

        if (componentId && !equalComponentId) {
          return;
        }

        handler(event);
      });

      return () => subscription.remove();
    }, [handler, componentId]);
  };
} catch (err) {
  console.log('RNN not used.');
}

export type GenericObjectType<T = string> = {
  [k: string]: T;
};

export type RowRenderer = (
  type: string | number,
  data: any,
  index: number,
  extendedState?: object,
) => JSX.Element | JSX.Element[] | null;

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
  componentId?: string; // presence of componentId, will enable RNN screenAppearHook
}

interface RLVState {
  dataProvider: DataProvider;
  data: any[];
  count: number;
  showFooterLoader: boolean;
  idIndexMap: GenericObjectType<number>;
  layoutProvider: LayoutProvider;
}
export default function RLV(props: RLVProps) {
  const {
    rowRenderer,
    getData,
    limit = 10,
    layoutProviderType,
    containerStyle,
    rlvStyle,
    rlvContentContainerStyle,
    cellHeight,
    noDataMessageRenderer,
    updateDataProvider, // update existing data
    getDataById,
    setNewData, // to re render RLV, re init everything
    componentId,
  } = props;
  const [state, setState] = useState<RLVState>({
    dataProvider: new DataProvider((r1, r2) => {
      return r1 !== r2;
    }),
    data: [],
    count: 0,
    showFooterLoader: false,
    idIndexMap: {},
    layoutProvider: getLayoutProvider(layoutProviderType, cellHeight),
  });

  const { dataProvider, layoutProvider, count, data: data1, showFooterLoader, idIndexMap: idIndexMap1 } = state;
  const data: any[] = data1;
  const idIndexMap: GenericObjectType<number> = idIndexMap1;

  getDataById &&
    getDataById((id: string) => {
      const index = idIndexMap[id];
      return data[index];
    });

  updateDataProvider &&
    updateDataProvider((id: string, newPartialRecord: GenericObjectType<any>) => {
      const index = idIndexMap[id];
      const oldRecord: GenericObjectType<{}> = data[index];

      const newRecord = { ...oldRecord, ...newPartialRecord };
      data[index] = newRecord;

      setState(_state => {
        return {
          ..._state,
          ...{ dataProvider: dataProvider.cloneWithRows(data, index) },
        };
      });
    });

  setNewData &&
    setNewData((newData: any[]) => {
      if (newData && Array.isArray(newData) && newData.length) {
        const newIdIndexMap: GenericObjectType<number> = {};
        newData.forEach((d, i) => {
          newIdIndexMap[d.id] = i;
        });

        setState(_state => {
          return {
            ..._state,
            ...{
              dataProvider: dataProvider.cloneWithRows(newData),
              data: newData,
              count: newData.length,
              idIndexMap: newIdIndexMap,
            },
          };
        });
      }
    });

  function renderFooter() {
    // Second view makes sure we don't unnecessarily change height of the list on this event. That might cause indicator to remain invisible
    // The empty view can be removed once you've fetched all the data
    return showFooterLoader ? (
      <ActivityIndicator style={styles.mar10} size="large" color="black" />
    ) : (
      <View style={styles.hei60} />
    );
  }

  async function fetchMoreData() {
    setState(_state => {
      return {
        ..._state,
        ...{ showFooterLoader: true },
      };
    });
    const newData = await getData(count, limit);

    newData.forEach((d: { id: string }, i) => {
      idIndexMap[d.id] = count + i;
    });

    const allData = data.concat(newData);

    setState(_state => {
      return {
        ..._state,
        ...{
          showFooterLoader: false,
          dataProvider: dataProvider.cloneWithRows(allData),
          data: allData,
          count: allData.length,
        },
      };
    });
  }

  function handleListEnd() {
    fetchMoreData();
  }

  try {
    useNavigationComponentDidAppear(() => {
      // console.log(`${e.componentName} appeared`, e);
      componentId && fetchMoreData();
    }, componentId);
  } catch (err) {
    console.log('RNN is not configured');
  }

  useLayoutEffect(() => {
    !componentId && fetchMoreData();
  }, []);

  return (
    <View style={[styles.container, containerStyle]}>
      {count > 0 ? (
        <RecyclerListView
          style={[styles.fl1, rlvStyle]}
          contentContainerStyle={[styles.mar3, rlvContentContainerStyle]}
          onEndReached={handleListEnd}
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          rowRenderer={rowRenderer}
          renderFooter={renderFooter}
          {...props}
        />
      ) : (
        !showFooterLoader && noDataMessageRenderer && noDataMessageRenderer()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hei60: { height: 60 },
  mar10: { margin: 10 },
  mar3: { margin: 3 },
  fl1: { flex: 1 },
  container: {
    flex: 1,
  },
});
