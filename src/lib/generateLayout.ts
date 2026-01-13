import { distributeItems } from './distributeItems';

export type AspectRatio = [number, number];

export const canvasWidth = 1920 as const;
export const canvasHeight = 1080 as const;
export const barHeight = 120 as const;
export const canvasPadding = 30 as const;
export const contentAspectRatios = [
  [16, 9],
  [5, 3],
  [3, 2],
  [4, 3],
  [8, 7],
  [10, 9],
  [16, 15],
  [4, 6],
] as const satisfies AspectRatio[];

export const transformAspectRatio = ([widthRatio, heightRatio]: [number, number]) => widthRatio / heightRatio;

export type ContentAspectRatio = (typeof contentAspectRatios)[number];

export const numericContentAspectRatios = contentAspectRatios.map(transformAspectRatio);
export const widestNumericContentAspectRatio = Math.max(...numericContentAspectRatios);
export const canvasPaddingTopBottom = canvasPadding * 3;
export const canvasGap = canvasPadding;
export const layoutGap = canvasGap / 2;
export const canvasContentWidth = canvasWidth - canvasPadding * 2;
export const canvasContentHeight = canvasHeight - barHeight - canvasPaddingTopBottom * 2;

export type LayoutAlignment =
  | 'center-column'
  | 'center'
  | 'left-column'
  | 'left'
  | 'right-column'
  | 'right'
  | 'space-between';

export interface LayoutConfig {
  contentMainAspectRatio: ContentAspectRatio;
  hasCamera?: boolean;
  hasContentSide?: boolean;
  hasName?: boolean;
  infoAspectRatio?: AspectRatio | 'auto';
}

export interface TransformInfo {
  x: number;
  y: number;
  boundingBoxWidth: number;
  boundingBoxHeight: number;
}

export interface LayoutTransformInfo {
  camera?: TransformInfo;
  contentMain: TransformInfo;
  contentSide?: TransformInfo;
  info?: TransformInfo;
  name?: TransformInfo;
}

export const generateLayout = (layoutConfigs: LayoutConfig[] /*, layoutAlignment: LayoutAlignment = 'center' */) => {
  const layoutConfigsTotal = layoutConfigs.length;
  console.log('layoutConfigsTotal', layoutConfigsTotal);

  if (!layoutConfigsTotal) return [];

  // Constants
  const result: LayoutTransformInfo[] = [];
  const canvasGridUnits = Math.ceil(Math.sqrt(layoutConfigsTotal));
  console.log('canvasGridUnits', canvasGridUnits);
  const rows = distributeItems(layoutConfigs);
  console.log('rows', JSON.stringify(rows));
  const rowsTotal = rows.length;
  console.log('rowsTotal', rowsTotal);
  const canvasGridUnitWidth = (canvasContentWidth - (canvasGridUnits - 1) * canvasGap) / canvasGridUnits;
  const canvasGridUnitHeight = (canvasContentHeight - (canvasGridUnits - 1) * canvasGap) / canvasGridUnits;
  console.log('canvasGridUnitHeight', canvasGridUnitHeight);
  const rowHeightMax =
    canvasGridUnitHeight * (canvasGridUnits / rowsTotal) + (canvasGridUnits / rowsTotal - 1) * canvasGap;
  console.log('rowHeightMax', rowHeightMax);
  const widestLayoutContentWidth = canvasGridUnitHeight * widestNumericContentAspectRatio;
  const layoutSideWidth = canvasGridUnitWidth - widestLayoutContentWidth - layoutGap;
  console.log('layoutSideWidth', layoutSideWidth);

  // Find widest row
  const rowWidths = rows.map((rowLayoutConfigs, rowsIndex) => {
    const { rowContentMainNumericAspectRatio, rowSideWidth } = rowLayoutConfigs.reduce(
      (acc, { contentMainAspectRatio, hasCamera = true, hasContentSide = false, infoAspectRatio }) => ({
        rowContentMainNumericAspectRatio:
          acc.rowContentMainNumericAspectRatio + transformAspectRatio(contentMainAspectRatio),
        rowSideWidth:
          acc.rowSideWidth + (hasCamera || hasContentSide || infoAspectRatio ? layoutGap + layoutSideWidth : 0),
      }),
      { rowContentMainNumericAspectRatio: 0, rowSideWidth: 0 },
    );
    console.log(`rows[${rowsIndex}]`, 'rowContentMainNumericAspectRatio', rowContentMainNumericAspectRatio);
    console.log(`rows[${rowsIndex}]`, 'rowSideWidth', rowSideWidth);
    const rowContentWidth = canvasGridUnitHeight * rowContentMainNumericAspectRatio;
    console.log(`rows[${rowsIndex}]`, 'rowContentWidth', rowContentWidth);

    return rowContentWidth + rowSideWidth + (rowsTotal - 1) * canvasGap;
  });
  console.log('rowWidths', rowWidths);
  const widestRowWidth = Math.max(...rowWidths);
  console.log('widestRowWidth', widestRowWidth);
  // const widestRowIndex = rowWidths.indexOf(widestRowWidth);
  // console.log('widestRowIndex', widestRowIndex);

  // Get row height
  const widestRowWidthFactor = canvasContentWidth / widestRowWidth;
  console.log('widestRowWidthFactor', widestRowWidthFactor);
  const widestRowHeight = widestRowWidthFactor * canvasGridUnitHeight;
  console.log('widestRowHeight', widestRowHeight);
  const rowHeight = Math.min(rowHeightMax, widestRowHeight);
  console.log('rowHeight', rowHeight);

  throw '';
  return result;
};

export const test = generateLayout([
  { contentMainAspectRatio: [4, 6], hasCamera: false },
  // { contentMainAspectRatio: [4, 3] },
  // { contentMainAspectRatio: [16, 9] },
  { contentMainAspectRatio: [16, 9] },
]);
