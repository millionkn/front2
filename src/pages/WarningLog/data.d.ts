export interface TableListItem {
  key: number,
  date: string,
  content: string,
  warningValue: number,
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}