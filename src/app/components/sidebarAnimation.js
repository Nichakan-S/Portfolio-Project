import styled from "styled-components";

const MenuIcon = styled.img`
  position: absolute;
  top: 60px;
  left: 34px;
  width: 42px;
  height: 42px;
  object-fit: cover;
`;
const HomeIcon = styled.img`
  position: absolute;
  top: 170px;
  left: 34px;
  width: 42px;
  height: 42px;
  object-fit: cover;
`;
const ResumeIcon = styled.img`
  position: absolute;
  top: 245px;
  left: 34px;
  width: 42px;
  height: 42px;
  object-fit: cover;
`;
const AddIcon = styled.img`
  position: absolute;
  top: 320px;
  left: 34px;
  width: 42px;
  height: 42px;
  object-fit: cover;
`;
const Property1default = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: 0px var(--br-81xl) 0px 0px;
  background-color: var(--color-white);
  box-shadow: 784px 0px 220px rgba(0, 0, 0, 0),
    502px 0px 201px rgba(0, 0, 0, 0.01), 282px 0px 169px rgba(0, 0, 0, 0.03),
    125px 0px 125px rgba(0, 0, 0, 0.04), 31px 0px 69px rgba(0, 0, 0, 0.05);
  width: 111px;
  height: 878px;
  overflow: hidden;
`;
const AddIcon1 = styled.img`
  position: absolute;
  top: 548px;
  left: 34px;
  width: 42px;
  height: 42px;
  object-fit: cover;
`;
const B = styled.b`
  position: absolute;
  top: 557px;
  left: 99px;
`;
const B1 = styled.b`
  position: absolute;
  top: 254px;
  left: 99px;
`;
const B2 = styled.b`
  position: absolute;
  top: 69px;
  left: 99px;
`;
const B3 = styled.b`
  position: absolute;
  top: 179px;
  left: 99px;
`;
const B4 = styled.b`
  position: absolute;
  top: 311px;
  left: 114px;
  color: rgba(39, 67, 129, 0.9);
`;
const Li = styled.li``;
const Ul = styled.ul`
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  padding-left: var(--padding-10xl);
`;
const B5 = styled.b`
  position: absolute;
  top: 346px;
  left: 80px;
  color: var(--color-darkslateblue-200);
`;
const B6 = styled.b`
  position: absolute;
  top: 387px;
  left: 80px;
  color: var(--color-darkslateblue-200);
`;
const B7 = styled.b`
  position: absolute;
  top: 428px;
  left: 80px;
  color: var(--color-darkslateblue-200);
`;
const B8 = styled.b`
  position: absolute;
  top: 469px;
  left: 80px;
  color: var(--color-darkslateblue-200);
`;
const Property1variant = styled.div`
  position: absolute;
  top: 20px;
  left: 226px;
  border-radius: 0px var(--br-81xl) 0px 0px;
  background-color: var(--color-white);
  box-shadow: 784px 0px 220px rgba(0, 0, 0, 0),
    502px 0px 201px rgba(0, 0, 0, 0.01), 282px 0px 169px rgba(0, 0, 0, 0.03),
    125px 0px 125px rgba(0, 0, 0, 0.04), 31px 0px 69px rgba(0, 0, 0, 0.05);
  width: 303px;
  height: 878px;
  overflow: hidden;
`;
const SidebarAnimationUserRoot = styled.div`
  width: 549px;
  border-radius: 5px;
  border: 1px dashed #9747ff;
  box-sizing: border-box;
  max-width: 100%;
  height: 918px;
  overflow: hidden;
  text-align: left;
  font-size: var(--font-size-3xl);
  color: var(--color-darkslateblue-100);
  font-family: var(--font-crimson-pro);
`;

const SidebarAnimationUser = () => {
  return (
    <SidebarAnimationUserRoot>
      <Property1default>
        <MenuIcon alt="" src="/menu@2x.png" />
        <HomeIcon alt="" src="/home@2x.png" />
        <ResumeIcon alt="" src="/resume@2x.png" />
        <AddIcon alt="" src="/add@2x.png" />
      </Property1default>
      <Property1variant>
        <MenuIcon alt="" src="/menu@2x.png" />
        <HomeIcon alt="" src="/home@2x.png" />
        <ResumeIcon alt="" src="/resume@2x.png" />
        <AddIcon1 alt="" src="/add@2x.png" />
        <B>เพิ่มผลงานของฉัน</B>
        <B1>แฟ้มผลงานของฉัน</B1>
        <B2>เมนู</B2>
        <B3>หน้าหลัก</B3>
        <B4>หมวดหมู่</B4>
        <B5>
          <Ul>
            <Li>การเรียนการสอน</Li>
          </Ul>
        </B5>
        <B6>
          <Ul>
            <Li>การทำวิจัย</Li>
          </Ul>
        </B6>
        <B7>
          <Ul>
            <Li>การบริการวิชาการ</Li>
          </Ul>
        </B7>
        <B8>
          <Ul>
            <Li>การทำนุบำรุงศิลป์</Li>
          </Ul>
        </B8>
      </Property1variant>
    </SidebarAnimationUserRoot>
  );
};

export default SidebarAnimationUser;
