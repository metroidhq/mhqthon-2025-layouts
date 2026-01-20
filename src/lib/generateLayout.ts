import { distributeItems } from './distributeItems';

export type AspectRatio = `${number}:${number}`;

export const canvasWidth = 1920 as const;
export const canvasHeight = 1080 as const;
export const barHeight = 120 as const;
export const canvasPadding = 30 as const;
export const contentAspectRatios = [
  '16:9',
  '5:3',
  '3:2',
  '4:3',
  '8:7',
  '10:9',
  '16:15',
  '1:1',
  '4:6',
] as const satisfies AspectRatio[];

export const contentSideAspectRatioDefault = '4:3';

export type ContentAspectRatio = (typeof contentAspectRatios)[number];

export const transformAspectRatio = (aspectRatio: AspectRatio) => {
  const ratios = aspectRatio.split(':');
  return Number(ratios[0]) / Number(ratios[1]);
};

export const contentNumericAspectRatios = contentAspectRatios.map(transformAspectRatio);
export const contentSideNumericAspectRatioDefault = transformAspectRatio(contentSideAspectRatioDefault);
export const widestNumericContentAspectRatio = Math.max(...contentNumericAspectRatios);
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

export interface LayoutMetricItem {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface LayoutMetric {
  camera?: LayoutMetricItem;
  contentMain: LayoutMetricItem;
  contentSide?: LayoutMetricItem;
  info?: LayoutMetricItem;
  name?: LayoutMetricItem;
}

export const generateLayout = (layoutConfigs: LayoutConfig[] /*, layoutAlignment: LayoutAlignment = 'center' */) => {
  const layoutConfigsTotal = layoutConfigs.length;

  if (!layoutConfigsTotal) return [];

  // Constants
  const canvasGridUnits = Math.ceil(Math.sqrt(layoutConfigsTotal));
  const rows = distributeItems(layoutConfigs);
  const rowsTotal = rows.length;
  const canvasGridUnitWidth = (canvasContentWidth - (canvasGridUnits - 1) * canvasGap) / canvasGridUnits;
  const canvasGridUnitHeight = (canvasContentHeight - (canvasGridUnits - 1) * canvasGap) / canvasGridUnits;
  const rowHeightMax =
    canvasGridUnitHeight * (canvasGridUnits / rowsTotal) + (canvasGridUnits / rowsTotal - 1) * canvasGap;
  const widestLayoutContentWidth = canvasGridUnitHeight * widestNumericContentAspectRatio;
  const layoutSideWidth = canvasGridUnitWidth - widestLayoutContentWidth - layoutGap;

  // Calculate row metrics
  const rowMetrics = rows.map((rowLayoutConfigs) => {
    const { contentMainNumericAspectRatio, sideWidthTotal } = rowLayoutConfigs.reduce(
      (acc, { contentMainAspectRatio, hasCamera = true, hasContentSide = false, infoAspectRatio }) => ({
        contentMainNumericAspectRatio: acc.contentMainNumericAspectRatio + transformAspectRatio(contentMainAspectRatio),
        sideWidthTotal:
          acc.sideWidthTotal + (hasCamera || hasContentSide || infoAspectRatio ? layoutGap + layoutSideWidth : 0),
      }),
      { contentMainNumericAspectRatio: 0, sideWidthTotal: 0 },
    );

    return {
      contentMainNumericAspectRatio,
      sideWidthTotal,
      width: canvasGridUnitHeight * contentMainNumericAspectRatio + sideWidthTotal + (canvasGridUnits - 1) * canvasGap,
    };
  });

  // Calculate row height
  const rowWidths = rowMetrics.map(({ width }) => width);
  const widestRowMetric = rowMetrics[rowWidths.indexOf(Math.max(...rowWidths))];
  const widestRowContentMainWidth =
    canvasContentWidth - (canvasGridUnits - 1) * canvasGap - widestRowMetric.sideWidthTotal;
  const widestRowHeight = widestRowContentMainWidth / widestRowMetric.contentMainNumericAspectRatio;
  const rowHeight = Math.min(rowHeightMax, widestRowHeight);

  // Calculate heights
  const cameraHeightMax = (rowHeight - layoutGap) / 2;
  const cameraHeightVariable = rowHeight - layoutGap - layoutSideWidth / contentSideNumericAspectRatioDefault;
  const cameraHeight = Math.min(cameraHeightMax, cameraHeightVariable);
  const nameHeight = cameraHeight / 3;
  const infoHeightMax = rowHeight - layoutGap - cameraHeight;

  // Calculate layout metrics
  const layoutMetrics: LayoutMetric[] = [];
  let rowY = canvasPaddingTopBottom + (canvasContentHeight - (rowHeight * rowsTotal + canvasGap * (rowsTotal - 1))) / 2;

  rows.forEach((rowLayoutConfigs) => {
    const rowLayoutConfigTotal = rowLayoutConfigs.length;
    const rowLayoutConfigMetrics = rowLayoutConfigs.map(
      ({ contentMainAspectRatio, hasCamera = true, hasContentSide = false, infoAspectRatio }) => ({
        contentMainWidth: transformAspectRatio(contentMainAspectRatio) * rowHeight,
        sideWidthTotal: hasCamera || hasContentSide || infoAspectRatio ? layoutGap + layoutSideWidth : 0,
      }),
    );
    const rowWidth = rowLayoutConfigMetrics.reduce(
      (acc, { contentMainWidth, sideWidthTotal }, rowLayoutConfigMetricIndex) => {
        const gap = rowLayoutConfigMetricIndex ? canvasGap : 0;
        return acc + gap + contentMainWidth + sideWidthTotal;
      },
      0,
    );

    // Calculate row Ys
    const cameraY = rowY + rowHeight - cameraHeight;
    const nameY = cameraY + cameraHeight - nameHeight;

    // Calculate row Xs
    let layoutX =
      canvasPadding +
      (canvasContentWidth - (rowWidth * rowLayoutConfigTotal - rowWidth * (rowLayoutConfigTotal - 1))) / 2;

    rowLayoutConfigs.forEach(
      ({ hasCamera = true, hasContentSide = false, hasName = true, infoAspectRatio }, layoutConfigIndex) => {
        // Calculate layout heights
        const infoHeight =
          infoAspectRatio && infoAspectRatio !== 'auto'
            ? layoutSideWidth / transformAspectRatio(infoAspectRatio)
            : infoHeightMax;

        // Calculate layout widths
        const nameWidth = hasCamera ? layoutSideWidth : rowLayoutConfigMetrics[layoutConfigIndex].contentMainWidth;

        // Calculate layout X
        const contentMainX = layoutX;
        const sideX = contentMainX + rowLayoutConfigMetrics[layoutConfigIndex].contentMainWidth + layoutGap;
        const nameX = hasCamera ? sideX : contentMainX;

        layoutMetrics.push({
          ...(hasCamera
            ? {
                camera: {
                  x: Math.round(sideX),
                  y: Math.round(cameraY),
                  width: Math.round(layoutSideWidth),
                  height: Math.round(cameraHeight),
                },
              }
            : {}),
          contentMain: {
            x: Math.round(contentMainX),
            y: Math.round(rowY),
            width: Math.round(rowLayoutConfigMetrics[layoutConfigIndex].contentMainWidth),
            height: Math.round(rowHeight),
          },
          ...(hasContentSide
            ? {
                contentSide: {
                  x: Math.round(sideX),
                  y: Math.round(rowY),
                  width: Math.round(layoutSideWidth),
                  height: Math.round(0), // todo
                },
              }
            : {}),
          ...(infoAspectRatio
            ? {
                info: {
                  x: Math.round(sideX),
                  y: Math.round(rowY), // todo
                  width: Math.round(layoutSideWidth),
                  height: Math.round(infoHeight),
                },
              }
            : {}),
          ...(hasName
            ? {
                name: {
                  x: Math.round(nameX),
                  y: Math.round(nameY),
                  width: Math.round(nameWidth),
                  height: Math.round(nameHeight),
                },
              }
            : {}),
        });

        // Refresh layout metrics
        layoutX +=
          rowLayoutConfigMetrics[layoutConfigIndex].contentMainWidth +
          rowLayoutConfigMetrics[layoutConfigIndex].sideWidthTotal +
          canvasGap;
      },
    );

    // Refresh row metrics
    rowY += rowHeight + canvasGap;
  });

  return layoutMetrics;
};
