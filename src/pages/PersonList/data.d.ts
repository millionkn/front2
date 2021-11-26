export interface TableListItem {
  key: number,
  mechinePosition: string;
  mechineType: string;
  personIdentifity: string;
  personName: string;
  personPhone: string;
  date: Date;
  action: string;
  state: string;
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