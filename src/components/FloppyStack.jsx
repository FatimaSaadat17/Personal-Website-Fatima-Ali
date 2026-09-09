import React from 'react';
import FloppyDisk from './FloppyDisk/FloppyDisk';
import AboutSection from './Sections/AboutSection';
import ProjectsSection from './Sections/ProjectsSection';
import SkillsSection from './Sections/SkillsSection';
import GreetingsSection from './Sections/GreetingsSection';

export default function FloppyStack({ activeTab, onSelectTab }) {
  const disks = [
    {
      id: 'greetings',
      title: 'Send a Greeting!',
      color: '#da91a3',
      sn: 'S/N 987654321',
      component: <GreetingsSection />
    },
    {
      id: 'skills',
      title: 'Skills',
      color: '#f3cf73',
      sn: 'S/N 554433221',
      component: <SkillsSection />
    },
    {
      id: 'projects',
      title: 'Projects',
      color: '#aad9dd',
      sn: 'S/N 778899001',
      component: <ProjectsSection />
    },
    {
      id: 'about',
      title: 'About me <3',
      color: '#c6ddaa',
      sn: 'S/N 123456789',
      component: <AboutSection />
    }
  ];

  const activeIdx = disks.findIndex(d => d.id === activeTab);

  return (
    <main className="floppy-stack-wrapper">
      <div className="floppy-stack-container">
        {disks.map((disk, idx) => {
          const isActive = activeTab === disk.id;
          const zIndex = isActive ? 50 : (idx + 1);
          const stackPosition = isActive ? 'active' : (idx < activeIdx ? 'above' : 'below');

          return (
            <FloppyDisk
              key={disk.id}
              id={disk.id}
              title={disk.title}
              color={disk.color}
              serialNumber={disk.sn}
              isActive={isActive}
              onSelect={onSelectTab}
              zIndex={zIndex}
              index={idx}
              stackPosition={stackPosition}
            >
              {disk.component}
            </FloppyDisk>
          );
        })}
      </div>
    </main>
  );
}
