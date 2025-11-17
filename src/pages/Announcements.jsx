import NavBar from '../components/NavBar';
import { CButton, CCollapse, CCard, CCardBody } from '@coreui/react';
import { useState } from 'react';
import '@coreui/coreui/dist/css/coreui.min.css';
import Header from '../components/Header';

//Versions: Major.Minor.Patch
//Major: Significant changes, possibly breaking backward compatibility.
//Minor: New features, backward-compatible.
//Patch: Bug fixes, backward-compatible.

export default function Announcements() {
  const [visible, setVisible] = useState({
    v1_0: false,
    v1_1: false,
  });

  const toggle = (key) => {
    setVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <NavBar />
      <h1>Announcements</h1>
      <h2>Release Notes</h2>
      <div>
        <CButton color="primary" onClick={() => toggle('v1_0')}>
          Version 1.0
        </CButton>
        <CCollapse visible={visible.v1_0}>
          <CCard className="mt-3">
            {/* Add the version 1.0 description here */}
          </CCard>
        </CCollapse>
      </div>
      <CButton color="primary" onClick={() => toggle('v1_1')}>
        Version 1.1
      </CButton>
      <CCollapse visible={visible.v1_1}>
        <CCard className="mt-3">
          {/* Add the version 1.1 description here */}
        </CCard>
      </CCollapse>
    </div>
  );
}
