import React from "react";
import withPageLayout from '../shared/withPageLayout';

import "../style/index.css";
import { FileText, Link, Linkedin, Mail } from "react-feather";

const GITHUB_IMG_URL = 'https://avatars.githubusercontent.com/u/6981727?v=4';
const GH_IMPROVEMENTML = 'https://github.com/Steven-Ireland/ImprovementML-Brain';
const GH_KRAKENSHEET = 'https://github.com/Steven-Ireland/krakensheet.com';
const GH_BLOG = 'https://github.com/Steven-Ireland/stevenire.land';
const GH_SPAM = 'https://github.com/Steven-Ireland/spam';
const GH_ACAPELLA = 'https://github.com/Steven-Ireland/Robot-Acapella';
const BRICK_URL = 'https://brick-cms.com';

const About = ({ data }) => {
  return (
    <section className="About">
      <div className="profile">
        <img src={GITHUB_IMG_URL} alt="Github avatar of me" className="profile-picture" />
        <h1>Hello There!</h1>
      </div>
      
      <p>
        I'm Steven Ireland, a lifelong Software Engineer most recently working at Netflix. 
      </p>
      <p>
        Outside of work, I hack on a slew of projects including:
      </p>
      <ul>
        <li>A GraphQL-first CMS platform, built with Next.js and Apollo Server <a href={BRICK_URL}><Link size={12}/></a></li>
        <li>A tiny general-purpose load testing tool built in Go <a href={GH_SPAM}><Link size={12}/></a></li>
        <li>A Reinforcement Learning based Unity Game where fantastical creatures learn to walk <a href={GH_IMPROVEMENTML}><Link size={12}/></a></li>
        <li>A Next-Generation character sheet application for tabletop games built with React, Redux, and Node.js <a href={GH_KRAKENSHEET}><Link size={12}/></a></li>
        <li>An interpreter to mash song lyrics and notes into Stephen Hawking's voice synth <a href={GH_ACAPELLA}><Link size={12}/></a></li>
        <li>And this website you're reading right now! <a href={GH_BLOG}><Link size={12}/></a></li>
      </ul>

      <section className="Contact">
        <a href="mailto:steven.ireland+sitecontact@protonmail.com">
          <Mail /> Email
        </a>
        <a href="https://www.linkedin.com/in/steven-ireland-6b545774/">
          <Linkedin /> Linkedin
        </a>
      </section>
    </section>
  );
};

export default withPageLayout(About);
