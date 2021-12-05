import { FastifyInstance } from 'fastify';

import logger from '@/lib/logger';

const StaticRoute = async (server: FastifyInstance) => {
  server.get('/', {}, async (req, res) => {
    try {
      res
        .code(200)
        .send(
          `Hi, I'm dustackle. I tackle with dust, especially fine dust. I can also tell you other chemicals causing air pollution. I'm totally free & open source. I'm licensed with the Affero General Public License v3.0. I'm copyleft!`
        );
    } catch (error) {
      logger.error(error);
      res.send(500);
    }
  });

  server.get('/privacy', {}, async (req, res) => {
    try {
      res.code(200).type('text/html').send(`
            <!DOCTYPE html>
            <html lang="ko">

            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <title>Privacy Policy</title>
            </head>
            
            <body>
              <h1>Privacy Policy of cliid.dev</h1>
            
            <p>cliid.dev operates the https://dustackle.cliid.dev website, which provides the SERVICE.</p>
            
            <p>This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the dustackle website.</p>
            
            <p>If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p>
            
            <p>The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at https://dustackle.cliid.dev, unless otherwise defined in this Privacy Policy.</p>
            
            <h2>Information Collection and Use</h2>
            
            <p>For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.</p>
            
            <h2>Log Data</h2>
            
            <p>We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer’s Internet Protocol ("IP") address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</p>
            
            <h2>Cookies</h2>
            
            <p>Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer’s hard drive.</p>
            
            <p>Our website uses these "cookies" to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.</p>
            
            <h2>Service Providers</h2>
            
            <p>We may employ third-party companies and individuals due to the following reasons:</p>
            
            <ul>
                <li>To facilitate our Service;</li>
                <li>To provide the Service on our behalf;</li>
                <li>To perform Service-related services; or</li>
                <li>To assist us in analyzing how our Service is used.</li>
            </ul>
            
            <p>We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p>
            
            <h2>Security</h2>
            
            <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>
            
            <h2>Links to Other Sites</h2>
            
            <p>Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
            
            <p>Children's Privacy</p>
            
            <p>Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.</p>
            
            <h2>Changes to This Privacy Policy</h2>
            
            <p>We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.</p>
            
            <h2>Contact Us</h2>
            
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
            </body>
            
            </html>`);
    } catch (error) {
      logger.error(error);
      res.send(500);
    }
  });

  server.get('/terms', {}, async (req, res) => {
    try {
      res.code(200).type('text/html').send(`
            <!DOCTYPE html>
            <html lang="ko">

            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <title>Terms of Service</title>
            </head>
            
            <body>
            
            <h1>Website Terms and Conditions of Use</h1>
            
            <h2>1. Terms</h2>
            
            <p>By accessing this Website, accessible from https://dustackle.cliid.dev, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>
            
            <h2>2. Use License</h2>
            
            <p>This Website is licensed within the GNU Affero General Public License 3.0. All rites reversed. (ɔ)</p>
            
            <h2>3. Disclaimer</h2>
            
            <p>All the materials on cliid.dev’s Website are provided "as is". cliid.dev makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, cliid.dev does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>
            
            <h2>4. Limitations</h2>
            
            <p>cliid.dev or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on cliid.dev’s Website, even if cliid.dev or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>
            
            <h2>5. Revisions and Errata</h2>
            
            <p>The materials appearing on cliid.dev’s Website may include technical, typographical, or photographic errors. cliid.dev will not promise that any of the materials in this Website are accurate, complete, or current. cliid.dev may change the materials contained on its Website at any time without notice. cliid.dev does not make any commitment to update the materials.</p>
            
            <h2>6. Links</h2>
            
            <p>cliid.dev has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by cliid.dev of the site. The use of any linked website is at the user’s own risk.</p>
            
            <h2>7. Site Terms of Use Modifications</h2>
            
            <p>cliid.dev may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.</p>
            
            <h2>8. Your Privacy</h2>
            
            <p>Please read our Privacy Policy.</p>
            
            <h2>9. Governing Law</h2>
            
            <p>Any claim related to cliid.dev's Website shall be governed by the laws of kr without regards to its conflict of law provisions.</p>
            </body>
            
            </html>
            `);
    } catch (error) {
      logger.error(error);
      res.send(500);
    }
  });
};

export default StaticRoute;
