"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recyclerlistview_1 = require("recyclerlistview");
const react_native_1 = require("react-native");
function getWindowWidth() {
    // To deal with precision issues on android
    return Math.round(react_native_1.Dimensions.get('window').width * 1000) / 1000 - 6; // Adjustment for margin given to RLV;
}
exports.getWindowWidth = getWindowWidth;
var LayoutProviderTypes;
(function (LayoutProviderTypes) {
    LayoutProviderTypes[LayoutProviderTypes["AUTO_ALIGN"] = 0] = "AUTO_ALIGN";
    LayoutProviderTypes[LayoutProviderTypes["TWO_COLUMN"] = 1] = "TWO_COLUMN";
    LayoutProviderTypes[LayoutProviderTypes["ONE_COLUMN"] = 2] = "ONE_COLUMN";
})(LayoutProviderTypes = exports.LayoutProviderTypes || (exports.LayoutProviderTypes = {}));
function getLayoutProvider(layoutType, height) {
    switch (layoutType) {
        case LayoutProviderTypes.AUTO_ALIGN:
            return new recyclerlistview_1.LayoutProvider(() => {
                return 'VSEL'; // Since we have just one view type
            }, (type, dim, index) => {
                const columnWidth = getWindowWidth() / 3;
                switch (type) {
                    case 'VSEL':
                        if (index % 3 === 0) {
                            dim.width = 3 * columnWidth;
                            dim.height = 300;
                        }
                        else if (index % 2 === 0) {
                            dim.width = 2 * columnWidth;
                            dim.height = 250;
                        }
                        else {
                            dim.width = columnWidth;
                            dim.height = 250;
                        }
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                }
            });
        case LayoutProviderTypes.TWO_COLUMN:
            return new recyclerlistview_1.LayoutProvider(() => {
                return 'VSEL';
            }, (type, dim) => {
                switch (type) {
                    case 'VSEL':
                        dim.width = getWindowWidth() / 2;
                        dim.height = height || 250;
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                }
            });
        default:
            return new recyclerlistview_1.LayoutProvider(() => {
                return 'VSEL';
            }, (type, dim) => {
                switch (type) {
                    case 'VSEL':
                        dim.width = getWindowWidth();
                        dim.height = height || 100;
                        break;
                    default:
                        dim.width = 0;
                        dim.height = 0;
                }
            });
    }
}
exports.getLayoutProvider = getLayoutProvider;
//# sourceMappingURL=LayoutUtil.js.map