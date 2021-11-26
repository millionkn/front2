import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import { Row, Col, Card } from "antd";
import styles from "./index.less";
import { useVideo } from '@/services/video';

export default () => {
  const video1 = useVideo(1);
  const video2 = useVideo(2);
  const video3 = useVideo(3);
  const video4 = useVideo(4);
  const video5 = useVideo(5);
  return (
    <PageContainer title={false} pageHeaderRender={false}>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Card bodyStyle={{ padding: 1 }}>
            <div ref={video1} className={styles.videoBlock}>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: 1 }}>
            <div ref={video2} className={styles.videoBlock}>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: 1 }}>
            <div ref={video3} className={styles.videoBlock}>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Card bodyStyle={{ padding: 1 }}>
            <div ref={video4} className={styles.videoBlock}>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: 1 }}>
            <div ref={video5} className={styles.videoBlock}>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
