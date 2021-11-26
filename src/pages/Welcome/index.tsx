import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Row, Col, Progress, List, Avatar, Card, Statistic, Form, DatePicker, Button, Modal } from "antd";
import { MiniBar, MiniProgress } from '../DashboardAnalysis/components/Charts';
import { MiniBarProps } from '../DashboardAnalysis/components/Charts/MiniBar';
import { useVideo } from '@/services/video';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import dayjs from 'dayjs';
import moment from 'moment';
import { useObservable } from '@/services/plantform-utils/react/observableHooks';
import { socketRequest } from '@/services/plantform-utils/socketRequest';


export default () => {
  const value1 = useObservable(() => 0, () => socketRequest(`api/mqtt/env`, { sequenceId: 'a01001' }))
  const value2 = useObservable(() => 0, () => socketRequest(`api/mqtt/env`, { sequenceId: 'a01002' }))
  const value3 = useObservable(() => 0, () => socketRequest(`api/mqtt/env`, { sequenceId: 'a34004' }))
  const value4 = useObservable(() => 0, () => socketRequest(`api/mqtt/env`, { sequenceId: 'PM10' }))

  const [miniBarProps] = useState<MiniBarProps>({
    data: (dayjs().daysInMonth()).times((i) => ({ x: i, y: Math.floor(Math.random() * 5) + 0.1 })),
    height: 107,
  })

  const video1 = useVideo(1);
  const video2 = useVideo(2);
  const video3 = useVideo(3);

  const [deadLine, setDeadLine] = useState(() => moment() as moment.Moment | null)
  const [nextDeadLine, setNextDeadLine] = useState(() => deadLine)
  const [showDeadLineEditor, setShowDeadLineEditor] = useState(() => false);
  return (
    <PageContainer title={false} pageHeaderRender={false}>
      <Modal
        title="编辑"
        visible={showDeadLineEditor}
        onCancel={() => setShowDeadLineEditor(false)}
        onOk={() => {
          setDeadLine(nextDeadLine);
          setShowDeadLineEditor(false)
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item
            label="预计完成时间"
            name="deadLine"
          >
            <DatePicker value={nextDeadLine} onChange={setNextDeadLine}></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
      <Row gutter={[16, 16]}>
        <Col span={6} style={{ display: 'flex' }}>
          <Card
            title="预计完成时间"
            className={styles.block}
            style={{ display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
            extra={<Button onClick={() => setShowDeadLineEditor(true)}>设置完成时间</Button>}
          >
            <div style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
              <Statistic value={78} formatter={(i) => `${i}%`} style={{ marginBottom: 16 }} />
              <MiniProgress percent={78} strokeWidth={8} target={80} color="#66bec1" />
            </div>
            <div style={{ padding: "12px 24px", fontSize: 16, borderTop: "1px solid #303030" }}> 预计完成时间:<span className={styles.number}>{deadLine?.format('YYYY-MM-DD') || '未设定'}</span> </div>
          </Card>
        </Col>
        <Col span={6} style={{ display: 'flex' }}>
          <Card title="本月报警数" className={styles.block} extra={<a href="#">详情</a>} style={{ display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
            <div style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
              <MiniBar {...miniBarProps}></MiniBar>
            </div>
            <div style={{ padding: "12px 24px", fontSize: 16, borderTop: "1px solid #303030" }}> 今日报警数<span className={styles.number}>000</span>起 </div>
          </Card>
        </Col>
        <Col span={12} style={{ display: 'flex' }}>
          <Card title="环境概况" className={styles.block} bodyStyle={{ padding: 0 }} extra={<Link to="/environment">更多</Link>}>
            {
              <>
                <Row justify="center" style={{ padding: 12, paddingBottom: 0 }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Progress type="circle" strokeColor="#f0cd40" strokeWidth={8} percent={100} format={(i) => <div style={{ color: '#f0cd40' }}>{value1}<span style={{ fontSize: '0.5em' }}>℃</span></div>} />
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Progress type="circle" strokeColor="#6bbd64" strokeWidth={8} percent={100} format={(i) => <div style={{ color: '#6bbd64' }}>{value2}<span style={{ fontSize: '0.5em' }}>%</span></div>} />
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Progress type="circle" strokeColor="#7fb4fa" strokeWidth={8} percent={100} format={(i) => <div style={{ color: '#7fb4fa' }}>{value3}<span style={{ fontSize: '0.5em' }}>ug/m³</span></div>} />
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Progress type="circle" strokeColor="#d75966" strokeWidth={8} percent={100} format={(i) => <div style={{ color: '#d75966' }}>{value4}<span style={{ fontSize: '0.5em' }}>ug/m³</span></div>} />
                  </Col>
                </Row>
                <Row justify="center" style={{ padding: 12, fontSize: 16 }}>
                  <Col span={6} style={{ textAlign: 'center' }}>温度</Col>
                  <Col span={6} style={{ textAlign: 'center' }}>湿度</Col>
                  <Col span={6} style={{ textAlign: 'center' }}>PM2.5</Col>
                  <Col span={6} style={{ textAlign: 'center' }}>PM10</Col>
                </Row>
              </>
            }
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={18} style={{ display: 'flex' }}>
          <Card title="视频监控" className={styles.block} extra={<Link to="/video">更多</Link>} style={{ display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', padding: 0 }}>
            <div style={{ flex: 2, margin: "16px 32px" }} ref={video1}></div>
            <div style={{ flex: 1, margin: 16, display: "flex", flexDirection: 'column' }}>
              <div style={{ flex: 1, marginBottom: 2 }} ref={video2}></div>
              <div style={{ flex: 1, marginTop: 2 }} ref={video3}></div>
            </div>
          </Card>
        </Col>
        <Col span={6} style={{ display: 'flex' }}>
          <Card title="进出管理" className={styles.block} bodyStyle={{ padding: 0 }} extra={<Link to="/person-list">更多</Link>}>
            <List size="large"
              itemLayout="vertical"
              dataSource={(7).times((i) => ({ id: i, name: `姓名${i + 1}`, date: '2021-01-11', time: '10:00:00', type: '进入', direction: '外墙保温' }))}
              renderItem={(item) => <List.Item style={{ padding: 0 }}>
                <Row gutter={[0, 8]} style={{ marginTop: 16 }}>
                  <Col offset={1} span={3}>
                    <Avatar size="small" icon={<UserOutlined />} style={{ position: 'absolute', float: 'right' }} />
                  </Col>
                  <Col span={8}>{item.name}</Col>
                  <Col span={8}>{item.direction}</Col>
                </Row>
                <Row gutter={[0, 8]}>
                  <Col offset={4} span={8}>{item.date}</Col>
                  <Col span={8}>{item.time}</Col>
                  <Col span={4}>进入</Col>
                </Row>
              </List.Item>}
            >
            </List>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
