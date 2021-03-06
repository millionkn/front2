import { PageContainer } from '@ant-design/pro-layout';
import React, { useState } from 'react';
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
import { useAsync } from '@/utils/hooks';
import axios from 'axios';



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


  const personLog = useAsync(() => axios.post<{
    data: {
      personName: string,
      date: string,
      personAction: string,
      personType: string,
    }[]
  }>(`api/table/person-log`, { page: { index: 1, size: 7 } }).then((x) => x.data.data.map((item, i) => ({
    id: i,
    name: item.personName,
    date: dayjs(item.date).format('YYYY-MM-DD'),
    time: dayjs(item.date).format('HH:mm:ss'),
    type: item.personAction === 'in' ? '??????' : item.personAction === 'out' ? '??????' : '--',
    direction: item.personType === 'whiteList' ? '?????????' : '--'
  }))), () => [], [])
  return (
    <PageContainer title={false} pageHeaderRender={false}>
      <Modal
        title="??????"
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
            label="??????????????????"
            name="deadLine"
          >
            <DatePicker value={nextDeadLine} onChange={setNextDeadLine}></DatePicker>
          </Form.Item>
        </Form>
      </Modal>
      <Row gutter={[16, 16]}>
        <Col span={6} style={{ display: 'flex' }}>
          <Card
            title="??????????????????"
            className={styles.block}
            style={{ display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
            extra={<Button onClick={() => setShowDeadLineEditor(true)}>??????????????????</Button>}
          >
            <div style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
              <Statistic value={78} formatter={(i) => `${i}%`} style={{ marginBottom: 16 }} />
              <MiniProgress percent={78} strokeWidth={8} target={80} color="#66bec1" />
            </div>
            <div style={{ padding: "12px 24px", fontSize: 16, borderTop: "1px solid #303030" }}> ??????????????????:<span className={styles.number}>{deadLine?.format('YYYY-MM-DD') || '?????????'}</span> </div>
          </Card>
        </Col>
        <Col span={6} style={{ display: 'flex' }}>
          <Card title="???????????????" className={styles.block} extra={<Link to="/person-list">??????</Link>} style={{ display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
            <div style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
              <MiniBar {...miniBarProps}></MiniBar>
            </div>
            <div style={{ padding: "12px 24px", fontSize: 16, borderTop: "1px solid #303030" }}> ???????????????<span className={styles.number}>000</span>??? </div>
          </Card>
        </Col>
        <Col span={12} style={{ display: 'flex' }}>
          <Card title="????????????" className={styles.block} bodyStyle={{ padding: 0 }} extra={<Link to="/environment">??????</Link>}>
            {
              <>
                <Row justify="center" style={{ padding: 12, paddingBottom: 0 }}>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Progress type="circle" strokeColor="#f0cd40" strokeWidth={8} percent={100} format={(i) => <div style={{ color: '#f0cd40' }}>{value1}<span style={{ fontSize: '0.5em' }}>???</span></div>} />
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Progress type="circle" strokeColor="#6bbd64" strokeWidth={8} percent={100} format={(i) => <div style={{ color: '#6bbd64' }}>{value2}<span style={{ fontSize: '0.5em' }}>%</span></div>} />
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Progress type="circle" strokeColor="#7fb4fa" strokeWidth={8} percent={100} format={(i) => <div style={{ color: '#7fb4fa' }}>{value3}<span style={{ fontSize: '0.5em' }}>ug/m??</span></div>} />
                  </Col>
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Progress type="circle" strokeColor="#d75966" strokeWidth={8} percent={100} format={(i) => <div style={{ color: '#d75966' }}>{value4}<span style={{ fontSize: '0.5em' }}>ug/m??</span></div>} />
                  </Col>
                </Row>
                <Row justify="center" style={{ padding: 12, fontSize: 16 }}>
                  <Col span={6} style={{ textAlign: 'center' }}>??????</Col>
                  <Col span={6} style={{ textAlign: 'center' }}>??????</Col>
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
          <Card title="????????????" className={styles.block} extra={<Link to="/video">??????</Link>} style={{ display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', padding: 0 }}>
            <div style={{ flex: 2, margin: "16px 32px" }} ref={video1}></div>
            <div style={{ flex: 1, margin: 16, display: "flex", flexDirection: 'column' }}>
              <div style={{ flex: 1, marginBottom: 2 }} ref={video2}></div>
              <div style={{ flex: 1, marginTop: 2 }} ref={video3}></div>
            </div>
          </Card>
        </Col>
        <Col span={6} style={{ display: 'flex' }}>
          <Card title="????????????" className={styles.block} bodyStyle={{ padding: 0 }} extra={<Link to="/person-list">??????</Link>}>
            <List size="large"
              itemLayout="vertical"
              dataSource={personLog}
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
                  <Col span={4}>??????</Col>
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
