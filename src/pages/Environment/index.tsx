import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Card, Tooltip, Modal, Form, Input, InputNumber, Button } from 'antd';
import { ChartCard } from '../DashboardAnalysis/components/Charts';
import MiniArea from './Components/MiniArea';
import moment from 'moment';
import styles from './index.less';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useObservable } from '@/services/plantform-utils/react/observableHooks';
import axios from 'axios';
import dayjs from 'dayjs';
import { socketRequest } from '@/services/plantform-utils/socketRequest';


export default () => {
  const value1 = useObservable(() => 0, () => socketRequest(`api/mqtt/env`, { sequenceId: 'a01001' }))
  const value2 = useObservable(() => 0, () => socketRequest(`api/mqtt/env`, { sequenceId: 'a01002' }))
  const value3 = useObservable(() => 0, () => socketRequest(`api/mqtt/env`, { sequenceId: 'a34004' }))
  const value4 = useObservable(() => 0, () => socketRequest(`api/mqtt/env`, { sequenceId: 'PM10' }))


  const [value1Array, setValue1Array] = useState<{ x: string, y: number }[]>(() => []);
  const [value2Array, setValue2Array] = useState<{ x: string, y: number }[]>(() => []);
  const [value3Array, setValue3Array] = useState<{ x: string, y: number }[]>(() => []);
  const [value4Array, setValue4Array] = useState<{ x: string, y: number }[]>(() => []);
  useEffect(() => {
    axios.post<{
      温度: {
        dateStr: string;
        value: number | null;
      }[];
      湿度: {
        dateStr: string;
        value: number | null;
      }[];
      PM25: {
        dateStr: string;
        value: number | null;
      }[];
      PM10: {
        dateStr: string;
        value: number | null;
      }[];
    }>(`api/chart/env`, {}, {
    }).then((res) => {
      setValue1Array(res.data.温度.map(({ dateStr, value }) => ({ x: dateStr, y: Number((value || 0).toFixed(2)) })))
      setValue2Array(res.data.湿度.map(({ dateStr, value }) => ({ x: dateStr, y: Number((value || 0).toFixed(2)) })))
      setValue3Array(res.data.PM25.map(({ dateStr, value }) => ({ x: dateStr, y: Number((value || 0).toFixed(2)) })))
      setValue4Array(res.data.PM10.map(({ dateStr, value }) => ({ x: dateStr, y: Number((value || 0).toFixed(2)) })))
    })
  }, [])

  const [tableAData, setTableAData] = useState<{
    date: string;
    temperature: string;
    humidity: string;
    PM2_5: string;
    PM10: string;
  }[]>(() => [])
  const [tableAPageIndex, setTablePageAIndex] = useState(() => 1)
  const [tableACount, setTableACount] = useState(() => 0)
  useEffect(() => {
    axios.post<{
      data: {
        date: string;
        温度: number | null;
        湿度: number | null;
        PM25: number | null;
        PM10: number | null;
      }[];
      count: number;
    }>(`api/table/env`, {
      page: {
        index: tableAPageIndex,
        size: 8,
      }
    }, {
    }).then((res) => {
      setTableACount(res.data.count)
      setTableAData(res.data.data.map((x) => ({
        date: dayjs(x.date).format('YYYY-MM-DD HH:mm:ss'),
        temperature: x.温度 === null ? '--' : `${x.温度}`,
        humidity: x.湿度 === null ? '--' : `${x.湿度}`,
        PM2_5: x.PM25 === null ? '--' : `${x.PM25}`,
        PM10: x.PM10 === null ? '--' : `${x.PM10}`,
      })))
    })
  }, [tableAPageIndex])
  const [tableBData, setTableBData] = useState(() => (8).times((i) => ({
    date: new Date(),
    warningType: `湿度`,
    warningValue: 94.5,
  })))
  const [tableBCount, setTableBCount] = useState(() => 8)



  const [showThresholdEditor, setShowThresholdEditor] = useState(() => false)
  return (
    <PageContainer title={false} pageHeaderRender={false}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <ChartCard
            title="温度"
            total={<>{value1}<span style={{ fontSize: '0.5em' }}>℃</span></>}
            contentHeight={46}
            action={
              <Tooltip
                title="当前温度"
              >
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <MiniArea color="#f0cd40" data={value1Array} tooltipFormatter={(x, y) => ({ name: x, value: `${y}℃` })} />
          </ChartCard>
        </Col>
        <Col span={6}>
          <ChartCard
            title="湿度"
            total={<>{value2}<span style={{ fontSize: '0.5em' }}>%</span></>}
            contentHeight={46}
            action={
              <Tooltip
                title="当前湿度"
              >
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <MiniArea color="#6bbd64" data={value2Array} tooltipFormatter={(x, y) => ({ name: x, value: `${Number(y).toFixed(2)}%` })} />
          </ChartCard>
        </Col>
        <Col span={6}>
          <ChartCard
            title="PM2.5"
            total={<>{value3}<span style={{ fontSize: '0.5em' }}>ug/m³</span></>}
            contentHeight={46}
            action={
              <Tooltip
                title="当前PM2.5"
              >
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <MiniArea color="#7fb4fa" data={value3Array} tooltipFormatter={(x, y) => ({ name: x, value: `${Number(y).toFixed(2)}ug/m³` })} />
          </ChartCard>
        </Col>
        <Col span={6}>
          <ChartCard
            title="PM10"
            total={<>{value4}<span style={{ fontSize: '0.5em' }}>ug/m³</span></>}
            contentHeight={46}
            action={
              <Tooltip
                title="当前PM10"
              >
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <MiniArea color="#59a5a7" data={value4Array} tooltipFormatter={(x, y) => ({ name: x, value: `${Number(y).toFixed(2)}ug/m³` })} />
          </ChartCard>
        </Col>
        <Col span={12} style={{ display: "flex" }}>
          <Card className={styles.block} title="环境监测记录">
            <Table
              pagination={{
                total: tableACount,
                pageSize: 8,

                onChange: (pageIndex) => { setTablePageAIndex(pageIndex) },
              }}
              columns={[
                {
                  title: '时间',
                  dataIndex: 'date',
                  render: (a) => moment(a).format('YYYY-MM-DD HH:mm:ss'),
                },
                {
                  title: '温度',
                  dataIndex: 'temperature',
                  render: (a) => `${Number(a).toFixed(2)}℃`,
                },
                {
                  title: '湿度',
                  dataIndex: 'humidity',
                  render: (a) => `${Number(a).toFixed(2)}%`,
                },
                {
                  title: 'PM2.5',
                  dataIndex: 'PM2_5',
                  render: (a) => `${Number(a).toFixed(2)}ug/m³`,
                },
                {
                  title: 'PM10',
                  dataIndex: 'PM10',
                  render: (a) => `${Number(a).toFixed(2)}ug/m³`,
                },
              ]}
              dataSource={tableAData}
            ></Table>
          </Card>
        </Col>
        <Col span={12} style={{ display: "flex" }}>
          <Modal
            title="编辑"
            visible={showThresholdEditor}
            onCancel={() => setShowThresholdEditor(false)}
            onOk={() => {
              setShowThresholdEditor(false)
            }}
          >
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              autoComplete="off"
            >
              <Form.Item
                label="PM2.5"
                name="PM2_5"
              >
                <InputNumber defaultValue={3}></InputNumber>
              </Form.Item>
              <Form.Item
                label="PM10"
                name="PM10"
              >
                <InputNumber defaultValue={3}></InputNumber>
              </Form.Item>
            </Form>
          </Modal>
          <Card className={styles.block} title="环境监测报警记录">
            <Table
              columns={[
                {
                  title: '序号',
                  render: (a, b, index) => index + 1,
                },
                {
                  title: '时间',
                  dataIndex: 'date',
                  render: (a) => moment(a).format('YYYY-MM-DD HH:mm:ss'),
                },
                {
                  title: '报警种类',
                  dataIndex: 'warningType',
                },
                {
                  title: '报警值',
                  dataIndex: 'warningValue',
                },
              ]}
              dataSource={tableBData}
            ></Table>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
