import { distributeItems } from './distributeItems';

export type AspectRatio = [number, number];

export const canvasWidth = 1920 as const;
export const canvasHeight = 1080 as const;
export const barHeight = 120 as const;
export const canvasPadding = 30 as const;
export const aspectRatios = [
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

export type AspectRatioContent = (typeof aspectRatios)[number];

export const aspectRatiosContent = aspectRatios.map(transformAspectRatio);
export const aspectRatioContentWidest = Math.max(...aspectRatiosContent);
export const canvasPaddingTopBottom = canvasPadding * 3;
export const canvasGap = canvasPadding;
export const layoutGap = canvasGap / 2;
export const canvasContentWidth = canvasWidth - canvasPadding * 2;
export const canvasContentHeight = canvasHeight - barHeight - canvasPaddingTopBottom * 2;

export interface LayoutConfig {
  contentMainAspectRatio: AspectRatioContent;
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

export const generateLayout = (layoutConfigs: LayoutConfig[]) => {
  const layoutTotal = layoutConfigs.length;
  console.log('layoutTotal', layoutTotal);

  if (!layoutTotal) return [];

  const result: LayoutTransformInfo[] = [];
  const layoutGridUnits = Math.ceil(Math.sqrt(layoutTotal));
  console.log('layoutGridUnits', layoutGridUnits);
  const layoutConfigGrid = distributeItems(layoutConfigs);
  console.log('layoutConfigGrid', JSON.stringify(layoutConfigGrid));
  const rowTotal = layoutConfigGrid.length;
  console.log('rowTotal', rowTotal);
  const layoutCanvasWidth = (canvasContentWidth - (layoutGridUnits - 1) * canvasGap) / layoutGridUnits;
  const layoutCanvasHeight = (canvasContentHeight - (layoutGridUnits - 1) * canvasGap) / layoutGridUnits;
  console.log('layoutCanvasHeight', layoutCanvasHeight);
  const widestContentWidth = layoutCanvasHeight * aspectRatioContentWidest;
  const sideWidth = layoutCanvasWidth - widestContentWidth - layoutGap;
  console.log('sideWidth', sideWidth);

  const rowHeights = layoutConfigGrid.map((layoutRow, layoutRowIndex) => {
    const rowLayoutTotal = layoutRow.length;
    console.log(`row ${layoutRowIndex + 1}`, 'rowLayoutTotal', rowLayoutTotal);
    const layoutContentData = layoutRow.map(
      ({ contentMainAspectRatio, hasCamera = true, hasContentSide = false, infoAspectRatio }) => ({
        contentMainAspectRatio: transformAspectRatio(contentMainAspectRatio),
        layoutSideWidth: hasCamera || hasContentSide || infoAspectRatio ? layoutGap + sideWidth : 0,
      }),
    );
    console.log(`row ${layoutRowIndex + 1}`, 'layoutContentData', JSON.stringify(layoutContentData));
    const { layoutContentMainAspectRatioTotal, layoutSideWidthTotal } = layoutContentData.reduce(
      (acc, { contentMainAspectRatio, layoutSideWidth }) => ({
        layoutContentMainAspectRatioTotal: acc.layoutContentMainAspectRatioTotal + contentMainAspectRatio,
        layoutSideWidthTotal: acc.layoutSideWidthTotal + layoutSideWidth,
      }),
      { layoutContentMainAspectRatioTotal: 0, layoutSideWidthTotal: 0 },
    );
    console.log(`row ${layoutRowIndex + 1}`, 'layoutContentMainAspectRatioTotal', layoutContentMainAspectRatioTotal);
    console.log(`row ${layoutRowIndex + 1}`, 'layoutSideWidthTotal', layoutSideWidthTotal);
    // const layoutContentWidth = canvasContentWidth - (layoutGridUnits - 1) * canvasGap - layoutSideWidthTotal;
    const layoutContentWidth = layoutCanvasHeight * aspectRatioContentWidest;
    console.log(`row ${layoutRowIndex + 1}`, 'layoutContentWidth', layoutContentWidth);

    const rowHeight = layoutCanvasWidth / layoutContentMainAspectRatioTotal;
    console.log('rowHeight', rowHeight);

    return rowHeight;
  });

  const rowHeightMin = Math.min(layoutCanvasHeight, ...rowHeights);
  console.log('rowHeightMin', rowHeightMin);

  return result;
};

// contentMainAspectRatio,
// hasCamera = true,
// hasContentSide = false,
// hasName = true,
// info,

export const test = generateLayout([
  // { contentMainAspectRatio: [4, 6], hasCamera: false },
  { contentMainAspectRatio: [16, 9] },
  { contentMainAspectRatio: [16, 9] },
  { contentMainAspectRatio: [16, 9] },
]);
