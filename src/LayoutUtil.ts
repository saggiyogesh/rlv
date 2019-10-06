import { LayoutProvider } from 'recyclerlistview';
import { Dimensions } from 'react-native';

export function getWindowWidth() {
  // To deal with precision issues on android
  return Math.round(Dimensions.get('window').width * 1000) / 1000 - 6; // Adjustment for margin given to RLV;
}

export enum LayoutProviderTypes {
  'AUTO_ALIGN',
  'TWO_COLUMN',
  'ONE_COLUMN', // default
}

export function getLayoutProvider(layoutType: LayoutProviderTypes | undefined, height?: number) {
  switch (layoutType) {
    case LayoutProviderTypes.AUTO_ALIGN:
      return new LayoutProvider(
        () => {
          return 'VSEL'; // Since we have just one view type
        },
        (type, dim, index) => {
          const columnWidth = getWindowWidth() / 3;
          switch (type) {
            case 'VSEL':
              if (index % 3 === 0) {
                dim.width = 3 * columnWidth;
                dim.height = 300;
              } else if (index % 2 === 0) {
                dim.width = 2 * columnWidth;
                dim.height = 250;
              } else {
                dim.width = columnWidth;
                dim.height = 250;
              }
              break;
            default:
              dim.width = 0;
              dim.height = 0;
          }
        },
      );
    case LayoutProviderTypes.TWO_COLUMN:
      return new LayoutProvider(
        () => {
          return 'VSEL';
        },
        (type, dim) => {
          switch (type) {
            case 'VSEL':
              dim.width = getWindowWidth() / 2;
              dim.height = height || 250;
              break;
            default:
              dim.width = 0;
              dim.height = 0;
          }
        },
      );
    default:
      return new LayoutProvider(
        () => {
          return 'VSEL';
        },
        (type, dim) => {
          switch (type) {
            case 'VSEL':
              dim.width = getWindowWidth();
              dim.height = height || 100;
              break;
            default:
              dim.width = 0;
              dim.height = 0;
          }
        },
      );
  }
}
