// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import { TableListItem } from './data.d';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      key: index,
      mechinePosition: `北辰工地现场西区2号南门`,
      mechineType: `海康威视`,
      personIdentifity: `SN796955433485056`,
      personName: `蒋曼曼`,
      personPhone: `1320110112`,
      date: new Date(),
      action: `枪机`,
      state: `流畅`,
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getRule(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;

  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: 1,
  };

  return res.json(result);
}

export default {
  'GET /api/rule': getRule,
  'Post /api/rule': (req: Request, res: Response, u: string) => {
    return res.json({});
  },
};
