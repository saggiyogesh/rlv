import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { DataProvider, RecyclerListView, LayoutProvider } from 'recyclerlistview';
import { getLayoutProvider, LayoutProviderTypes } from './LayoutUtil';

export type GenericObjectType<T = string> = {
  [k: string]: T;
};

export type RowRenderer = (
  type: string | number,
  data: any,
  index: number,
  extendedState?: object,
) => JSX.Element | JSX.Element[] | null;

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

interface RLVState {
  dataProvider: DataProvider;
  data: any[];
  count: number;
  showFooterLoader: boolean;
  idIndexMap: GenericObjectType<number>;
  layoutProvider: LayoutProvider;
}
export default function RLV({
  rowRenderer,
  getData,
  limit = 10,
  layoutProviderType,
  containerStyle,
  rlvStyle,
  rlvContentContainerStyle,
  cellHeight,
  forceNonDeterministicRendering,
  noDataMessageRenderer,
  updateDataProvider, // update existing data
  getDataById,
  setNewData, // to re render RLV, re init everything
}: RLVProps) {
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

  useEffect(() => {
    fetchMoreData();
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
          forceNonDeterministicRendering={forceNonDeterministicRendering}
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
