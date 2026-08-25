import React, { useState } from 'react';

const ReadingSection = ({setBandScore}) => {

  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: [],
    question7: [],
    question8: [],
    question9: [],
    question10: '',
    question11: '',
    question12: '',
    question13: '',
    question14: '',
    question15: '',
    question16: '',
    question17: '',
    question18: '',
    question19: '',
    question20: '',
    question21: '',
    question22: '',
    question23: '',
    question24: [],
    question25: [],
    question26: [],
    question27: '',
    question28: '',
    question29: '',
    question30: '',
    question31: '',
    question32: '',
    question33: '',
    question34: '',
    question35: '',
    question36: '',
    question37: '',
    question38: '',
    question39: '',
    question40: ''
  });

  const correctAnswers = {
    question1: 'B',
    question2: 'C',
    question3: 'A',
    question4: 'C',
    question5: 'D',
    question6: ['D', 'F', 'A', 'G'],
    question7: ['D', 'F', 'A', 'G'],
    question8: ['D', 'F', 'A', 'G'],
    question9: ['D', 'F', 'A', 'G'],
    question10: ['Y', 'YES'],
    question11: ['NOT GIVEN', 'NG'],
    question12: ['NOT GIVEN', 'NG'],
    question13: ['NO', 'N'],
    question14: ['NO', 'N'],
    question15: ['NO', 'N'],
    question16: ['Y', 'YES'],
    question17: ['NOT GIVEN', 'NG'],
    question18: ['Y', 'YES'],
    question19: ['NO', 'N'],
    question20: ['NOT GIVEN', 'NG'],
    question21: 'D',
    question22: 'D',
    question23: 'D',
    question24: ['B', 'C', 'D'],
    question25: ['B', 'C', 'D'],
    question26: ['B', 'C', 'D'],
    question27: 'A',
    question28: 'F',
    question29: 'C',
    question30: 'D',
    question31: 'B',
    question32: 'E',
    question33: 'H',
    question34: 'C',
    question35: 'functional',
    question36: 'mass monsters',
    question37: 'injuries',
    question38: 'weight training',
    question39: 'unstable',
    question40: 'recover'
  };

  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái để kiểm tra đã gửi hay chưa

  const calculateBandScore = (score) => {
    
    if (score >= 39) return 8.5;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 20) return 5.5;
    if (score >= 16) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    if (score >= 7) return 3.5;
    if (score >= 5) return 3.0;
    if (score >= 3) return 2.5;
    return 0;
  };

  const checkAnswers = () => {
    let newScore = 0;
    const usedAnswers = new Set();

    for (let i = 1; i <= 40; i++) {
      let userAnswerRaw = answers[`question${i}`];
      const correctAnswer = correctAnswers[`question${i}`];

      if (!correctAnswer || userAnswerRaw === undefined || userAnswerRaw === null) {
        continue;
      }

      const userAnswer = Array.isArray(userAnswerRaw)
        ? userAnswerRaw.map(a => a.toString().trim())
        : userAnswerRaw ? [userAnswerRaw.toString().trim()] : [];

      if (typeof correctAnswer === 'string') {
        if (userAnswer.length > 0 && correctAnswer.toLowerCase() === userAnswer[0].toLowerCase()) {
          newScore++;
        }
      } else if (Array.isArray(correctAnswer)) {
        for (const answer of userAnswer) {
          if (correctAnswer.some(correctAns => correctAns.toLowerCase() === answer.toLowerCase())
            && !usedAnswers.has(answer.toLowerCase())) {
            newScore++;
            usedAnswers.add(answer.toLowerCase());
          }
        }
      }
    }

    const bandScore = calculateBandScore(newScore); // Tính band điểm từ số câu đúng
    setBandScore(bandScore); // Lưu band điểm
    localStorage.setItem('readingScore', newScore);
    setIsSubmitted(true);
  };



  return (
    <div className="container mt-5">
  <p className="bg-warning text-center" style={{ fontSize: '36px', fontFamily: 'Helvetica' }}>
    <strong>B. READING - 60 MINUTES</strong>
  </p>

  <table className="table">
  <tbody>
    <tr>
      <td style={{ verticalAlign: 'top', width: '60%',height: '100%' }}>
        <div style={{  overflowY: "auto",maxHeight: "100vh", backgroundColor: '#fffeec', padding: '5px',height: '100%' }}>
          <div align="center">
            <strong>
              <span style={{ fontSize: '20px', fontFamily: 'Helvetica', lineHeight: '24px', color: '#000000' }}>
                PASSAGE 1: THE ANTS
              </span>
            </strong>
          </div>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>A</strong> The ants are tiny and usually nest between rocks in the south coast of England. Transformed into research subjects at the University of Bristol, they raced along with a tabletop foraging for food - and then, remarkably, returned to guide others. Time and again, followers trailed behind leaders, darting this way and that along the route, presumably to memorise landmarks. Once a follower got its bearings, it tapped the leader with its antennae, prompting the lesson to literally proceed to the next step. The ants were only looking for food, but the researchers said the careful way the leaders led followers, thereby turning them into leaders in their own right, marked the Temnothorax albipennis ant as the very first example of a non-human animal exhibiting teaching behaviour.
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>B</strong> "Tandem running is an example of teaching, to our knowledge the first in a non-human animal, that involves bidirectional feedback between teacher and pupil,” remarks Nigel Franks, professor of animal behaviour and ecology, whose paper on the ant educators was published last week in the journal Nature.
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>C</strong> No sooner was the paper published, of course, than another educator questioned it. Marc Hauser, a psychologist and biologist and one of the scientists who came up with the definition of teaching, said it was unclear whether the ants had learned a new skill or merely acquired new information.
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>D</strong> Later, Franks took a further study and found that there were even races between leaders. With the guidance of leaders, ants could find food faster. But the help comes at a cost for the leader, who normally would have reached the food about four times faster if not hampered by a follower. This means the hypothesis that the leaders deliberately slowed down in order to pass the skills on to the followers seems potentially valid. His ideas were advocated by the students who carried out the video project with him.
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>E</strong> Opposing views still arose, however. Hauser noted that mere communication of information is commonplace in the animal world. Consider a species, for example, that uses alarm calls to warn fellow members about the presence. Sounding the alarm can be costly, because the animal may draw the attention of the predator to itself. But it allows others to flee to safety. “Would you call this teaching?” wrote Hauser. “The caller incurs a cost. The naive animals gain a benefit and new knowledge that better enables them to learn about the predator's location than if the caller had not called. This happens throughout the animal kingdom, but we don't call it teaching, even though it is clearly a transfer of information.
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>F</strong> Tim Caro, a zoologist, presented two cases of animal communication. He found that cheetah mothers that take their cubs along on hunts gradually allow their cubs to do more of the hunting —going, for example, from killing a gazelle and allowing young cubs to eat merely tripping the gazelle and letting the cubs finish it off. At one level, such behaviour might be called teaching — except the mother was not really teaching the cubs to hunt but merely facilitating various stages of learning. In another instance, birds watching other birds using a stick to locate food such as insects and so on, are observed to do the same thing themselves while finding food later.
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>G</strong> Psychologists study animal behaviour in part to understand the evolutionary roots of human behaviour, Hauser said. The challenge in understanding whether other animals truly teach one another, he added, is that human teaching involves a “theory of mind” teachers are aware that students don't know something. He questioned whether Franks' leader ants really knew that the follower ants were ignorant. Could they simply have been following an instinctive rule to proceed when the followers tapped them on the legs or abdomen? And did leaders that led the way to food - only to find that it had been removed by the experimenter - incur the wrath of followers? That, Hauser said, would suggest that the follower ant actually knew the leader was more knowledgeable and not merely following an instinctive routine itself.
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>H</strong> The controversy went on and for a good reason. The occurrence of teaching in ants, if proven to be true, indicates that teaching can evolve in animals with tiny brains. It is probably the value of information in social animals that determines when teaching will evolve, rather than the constraints of brain size.
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>I</strong> Bennett Galef Jr., a psychologist who studies animal behaviour and social learning at McMaster University in Canada, maintained that ants were unlikely to have a "theory of mind” - meaning that leaders and followers may well have been following instinctive routines that were not based on an understanding of what was happening in another ant's brain. He warned that scientists may be barking up the wrong tree when they look not only for examples of humanlike behaviour among other animals but humanlike thinking that underlies such behaviour. Animals may behave in ways similar to humans without a similar cognitive system, he said, so the behaviour is not necessarily a good guide into how humans came to think the way we do.
          </p>
        </div>
      </td>
      <td style={{  overflowY: "auto",verticalAlign: 'top', width: '40%', fontSize: '16px', fontFamily: 'Helvetica',height: '100%',position: "relative" }}>
      <div 
          style={{
            top: "10px",
            maxHeight: "100vh",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "white" }}
          
        >
        <p style={{ fontSize: '20px' }}>
          <strong>Questions 1-5. Match the person A-D with the correct information</strong>
        </p>
        <p style={{ fontSize: '18px' }}>A. Bennett Galef Jr</p>
        <p style={{ fontSize: '18px' }}>B. Tim Caro</p>
        <p style={{ fontSize: '18px' }}>C. Nigel Franks</p>
        <p style={{ fontSize: '18px' }}>D. Marc Hauser</p>

        <p style={{ fontSize: '18px' }}>
          1. <input type="text" value={answers.question1} onChange={(e) => setAnswers({ ...answers, question1: e.target.value })} />
          Animals could use objects to locate food.
        </p>
        <p style={{ fontSize: '18px' }}>
          2. <input type="text" value={answers.question2} onChange={(e) => setAnswers({ ...answers, question2: e.target.value })} />
          Ants show two-way, interactive teaching behaviours.
        </p>
        <p style={{ fontSize: '18px' }}>
          3. <input type="text" value={answers.question3} onChange={(e) => setAnswers({ ...answers, question3: e.target.value })} />
          It is risky to say ants can teach other ants like human beings do.
        </p>
        <p style={{ fontSize: '18px' }}>
          4. <input type="text" value={answers.question4} onChange={(e) => setAnswers({ ...answers, question4: e.target.value })} />
          Ant leadership makes finding food faster.
        </p>
        <p style={{ fontSize: '18px' }}>
          5. <input type="text" value={answers.question5} onChange={(e) => setAnswers({ ...answers, question5: e.target.value })} />
          Communication between ants is not entirely teaching.
        </p>
        <span style={{ fontSize: '18px', fontFamily: 'Helvetica' }}>
          <strong>Questions 6-9: </strong>
          <strong>Which FOUR of the following behaviours of animals are mentioned in the passage?</strong>
        </span>

        <div className="column col-12">
          <span style={{ fontSize: '18px', fontFamily: 'Helvetica' }}>
            <strong>A</strong>: Warn others in the presence of a threat <br />
            <strong>B</strong>: Evade potential predators <br />
            <strong>C</strong>: Safeguard their offspring <br />
            <strong>D</strong>: Establish contact using antennae <br />
            <strong>E</strong>: Interact among themselves <br />
            <strong>F</strong>: Engage in hunting to provide sustenance for their juveniles <br />
            <strong>G</strong>: Use tools like twigs <br />
            <strong>H</strong>: Consume a diverse range of nourishment
          </span>
        </div>
        <p>
          <strong>ANSWER</strong>:
          <input type="text" value={answers.question6} onChange={(e) => setAnswers({ ...answers, question6: e.target.value })} />
          <input type="text" value={answers.question7} onChange={(e) => setAnswers({ ...answers, question7: e.target.value })} />
          <input type="text" value={answers.question8} onChange={(e) => setAnswers({ ...answers, question8: e.target.value })} />
          <input type="text" value={answers.question9} onChange={(e) => setAnswers({ ...answers, question9: e.target.value })} />
        </p>
        <p>&nbsp;</p>
        <p>
          <span style={{ fontSize: '18px', fontFamily: 'Helvetica' }}>
            <strong>Questions 10-13 YES/NO/NOT GIVEN </strong>
          </span>
        </p>
        <p>
          <span style={{ fontSize: '18px', fontFamily: 'Helvetica' }}>
            <strong>10.</strong> <input type="text" value={answers.question10} onChange={(e) => setAnswers({ ...answers, question10: e.target.value })} /> Ants' tandem running involves two-way communication.
          </span>
        </p>
        <p>
          <span style={{ fontSize: '18px', fontFamily: 'Helvetica' }}>
            <strong>11.</strong> <input type="text" value={answers.question11} onChange={(e) => setAnswers({ ...answers, question11: e.target.value })} /> Franks's theory got many supporters immediately after publicity.
          </span>
        </p>
        <p>
          <span style={{ fontSize: '18px', fontFamily: 'Helvetica' }}>
            <strong>12.</strong> <input type="text" value={answers.question12} onChange={(e) => setAnswers({ ...answers, question12: e.target.value })} /> Ants' teaching behaviour is the same as that of human.
          </span>
        </p>
        <p>
          <span style={{ fontSize: '18px', fontFamily: 'Helvetica' }}>
            <strong>13.</strong> <input type="text" value={answers.question13} onChange={(e) => setAnswers({ ...answers, question13: e.target.value })} /> Cheetah hide hunting gains from younger one.
          </span>
        </p>
        </div>
      </td>
    </tr>
  </tbody>
</table>
  <div className="container mt-5">
  <table className="table">
    <tbody>
      <tr>
        <td style={{ verticalAlign: 'top', width: '800px', maxHeight: '500px' }}>
        <div style={{  overflowY: "auto",maxHeight: "100vh", backgroundColor: '#fffeec', padding: '5px',height: '100%' }}>
            <div align="center">
              <strong>
                <span style={{ fontSize: '20px', fontFamily: 'Helvetica', lineHeight: '24px', color: '#000000' }}>
                  Passage 2: <strong>Zoo conservation programmes</strong>
                </span>
              </strong>
            </div>
            <div style={{ textAlign: 'justify' }}>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                One of London Zoo's recent advertisements caused me some irritation, so patently did it distort reality. Headlined "Without zoos, you might as well tell these animals to get stuffed", it was bordered with illustrations of several endangered species and went on to extol the myth that without zoos like London Zoo these animals "will almost certainly disappear forever". With the zoo world's rather mediocre record on conservation, one might be forgiven for being slightly sceptical about such an advertisement.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                Zoos were originally created as places of entertainment, and their suggested involvement with conservation didn't seriously arise until about 30 years ago when the Zoological Society of London held the first formal international meeting on the subject. Eight years later, a series of world conferences took place, entitled "The Breeding of Endangered Species", and from this point onwards conservation became the zoo community's buzzword. This commitment has now been clearly defined in The World Zoo Conservation Strategy (WZGS, September 1993), which although an important and welcome document does seem to be based on an unrealistic optimism about the nature of the zoo industry.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                The WZCS estimates that there are about 10,000 zoos in the world, of which around 1,000 represent a core of quality collections capable of participating in co-ordinated conservation programmes. This is probably the document's first failing, as I believe that 10,000 is a serious underestimate of the total number of places masquerading as zoological establishments. Of course, it is difficult to get accurate data but, to put the issue into perspective, I have found that, in a year of working in Eastern Europe, I discover fresh zoos on almost a weekly basis.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                The second flaw in the reasoning of the WZCS document is the naive faith it places in its 1,000 core zoos. One would assume that the calibre of these institutions would have been carefully examined, but it appears that the criterion for inclusion on this select list might merely be that the zoo is a member of a zoo federation or association. This might be a good starting point, working on the premise that members must meet certain standards, but again the facts don't support the theory.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                The greatly respected American Association of Zoological Parks and Aquariums (AAZPA) has had extremely dubious members, and in the UK the Federation of Zoological Gardens of Great Britain and Ireland has occasionally had members that have been roundly censured in the national press. These include Robin Hill Adventure Park on the Isle of Wight, which many considered the most notorious collection of animals in the country. This establishment, which for years was protected by the Isle's local council (which viewed it as a tourist amenity), was finally closed down following a damning report by a veterinary inspector appointed under the terms of the Zoo Licensing Act 1981.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                Even assuming that the WZCS's 1,000 core zoos are all of a high standard complete with scientific staff and research facilities, trained and dedicated keepers, accommodation that permits normal or natural behaviour, and a policy of co-operating fully with one another what might be the potential for conservation? Colin Tudge, author of Last Animals at the Zoo (Oxford University Press, 1992), argues that "if the world's zoos worked together in co-operative breeding programmes, then even without further expansion they could save around 2,000 species of endangered land vertebrates". This seems an extremely optimistic proposition from a man who must be aware of the failings and weaknesses of the zoo industry the man who, when a member of the council of London Zoo, had to persuade the zoo to devote more of its activities to conservation.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                Today approximately 16 species might be said to have been "saved" by captive breeding programmes, although a number of these can hardly be looked upon as resounding successes. Beyond that, about a further 20 species are being seriously considered for zoo conservation programmes. Given that the international conference at London Zoo was held 30 years ago, this is pretty slow progress and a long way off Tudge's target of 2,000.
              </p>
            </div>
          </div>
        </td>
        <td style={{  overflowY: "auto",verticalAlign: 'top', width: '40%', fontSize: '16px', fontFamily: 'Helvetica',height: '100%',position: "relative" }}>\
        <div 
          style={{
            top: "10px",
            maxHeight: "100vh",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "white" }}
          
        >
          <p style={{ fontSize: '18px' }}>
            <strong>Questions 14-20 YES/NO/NOT GIVEN</strong>
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>14.</strong> <input type="text" value={answers.question14} onChange={(e) => setAnswers({ ...answers, question14: e.target.value })} />
            London Zoo's advertisements are honest.
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>15.</strong> <input type="text" value={answers.question15} onChange={(e) => setAnswers({ ...answers, question15: e.target.value })} />
            The Zoos record on conservation should not be doubted.
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>16.</strong> <input type="text" value={answers.question16} onChange={(e) => setAnswers({ ...answers, question16: e.target.value })} />
            Zoos made an insignificant contribution to conservation up until 30 years ago.
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>17.</strong> <input type="text" value={answers.question17} onChange={(e) => setAnswers({ ...answers, question17: e.target.value })} />
            The WZCS document is not known in Eastern Europe.
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>18.</strong> <input type="text" value={answers.question18} onChange={(e) => setAnswers({ ...answers, question18: e.target.value })} />
            Zoos in the WZCS select list were carelessly inspected.
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>19.</strong> <input type="text" value={answers.question19} onChange={(e) => setAnswers({ ...answers, question19: e.target.value })} />
            No-one knew how the animals were being treated at Robin Hill Adventure Park.
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>20.</strong> <input type="text" value={answers.question20} onChange={(e) => setAnswers({ ...answers, question20: e.target.value })} />
            Colin Tudge was dissatisfied with the treatment of animals at London Zoo.
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>21.</strong> What were the objectives of the WZCS document?
            <br />
            A. to improve the calibre of zoos worldwide
            <br />
            B. to list the endangered species of the world
            <br />
            C. to provide funds for zoos in underdeveloped countries
            <br />
            D. to identify zoos suitable for conservation practice
            <br />
            <strong>ANSWER:</strong> <input type="text" value={answers.question21} onChange={(e) => setAnswers({ ...answers, question21: e.target.value })} />
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>22.</strong> Why does the writer refer to Robin Hill Adventure Park?
            <br />
            A. to exemplify the standards in AAZPA zoos
            <br />
            B. to illustrate a weakness in the WZCS document
            <br />
            C. to support the Isle of Wight local council
            <br />
            D. to criticise the 1981 Zoo Licensing Act
            <br />
            <strong>ANSWER:</strong> <input type="text" value={answers.question22} onChange={(e) => setAnswers({ ...answers, question22: e.target.value })} />
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>23.</strong> What word best describes the writer's response to Colin Tudge's prediction on captive breeding programmes?
            <br />
            A. impartial
            <br />
            B. accepting
            <br />
            C. prejudiced
            <br />
            D. disbelieving
            <br />
            <strong>ANSWER:</strong> <input type="text" value={answers.question23} onChange={(e) => setAnswers({ ...answers, question23: e.target.value })} />
          </p>
          <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
            <strong>Questions 24-26</strong>
          </p>
          <p style={{ fontSize: '18px' }}>
            The writer mentions a number of factors which lead him to doubt the value of the WZCS document. Which THREE of the following factors are mentioned?
          </p>
          <div style={{ fontSize: '18px' }}>
            A. the lack of money in developing countries <br />
            B. the number of unregistered zoos in the world <br />
            C. the unrealistic aim of the WZCS in view of the number of species "saved" to date <br />
            D. the failure of the WZCS to examine the standards of the "core zoos" <br />
            E. the actions of the Isle of Wight local council <br />
            F. the policies of WZCS zoo managers <br />
          </div>
          <p style={{ fontSize: '18px' }}>
            <strong>ANSWER:</strong> <input type="text" value={answers.question24} onChange={(e) => setAnswers({ ...answers, question24: e.target.value })} />; 
            <input type="text" value={answers.question25} onChange={(e) => setAnswers({ ...answers, question25: e.target.value })} />; 
            <input type="text" value={answers.question26} onChange={(e) => setAnswers({ ...answers, question26: e.target.value })} />
          </p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div className="container mt-5">
  <table className="table">
    <tbody>
      <tr>
        <td style={{ verticalAlign: 'top', width: '800px' }}>
           <div style={{  overflowY: "auto",maxHeight: "100vh", backgroundColor: '#fffeec', padding: '5px',height: '100%' }}>
           <div 
          style={{
            top: "10px",
            maxHeight: "100vh",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "white" }}
          
        >
              <strong>
                <span style={{ fontSize: '20px', fontFamily: 'Helvetica', lineHeight: '24px', color: '#000000' }}>
                  Passage 3: <strong>CALISTHENICS</strong>
                </span>
              </strong>
            </div>
            <div style={{ textAlign: 'justify' }}>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                <strong>A</strong> From the very first caveman to scale a tree or hang from a cliff face, to the mighty armies of the Greco-Roman empires and the gymnasiums of modern American high schools, calisthenics has endured and thrived because of its simplicity and utility. Unlike strength training which involves weights, machines or resistance bands, calisthenics uses only the body's own weight for physical development.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                <strong>B</strong> Calisthenics enters the historical record at around 480 B.C., with Herodotus' account of the Battle of Thermopylae. Herodotus reported that, prior to the battle, the god-king Xerxes sent a scout party to spy on his Spartan enemies. The scouts informed Xerxes that the Spartans, under the leadership of King Leonidas, were practising some kind of bizarre, synchronised movements akin to a tribal dance. Xerxes was greatly amused. His own army was comprised of over 120,000 men, while the Spartans had just 300. Leonidas was informed that he must retreat or face annihilation. The Spartans did not retreat, however, and in the ensuing battle, they managed to hold Xerxes' enormous army at bay for some time until reinforcements arrived. It turns out their tribal dance was not a superstitious ritual but a form of calisthenics by which they were building awe-inspiring physical strength and endurance.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                <strong>C</strong> The Greeks took calisthenics seriously not only as a form of military discipline and strength but also as an artistic expression of movement and an aesthetically ideal physique. Indeed, the term calisthenics itself is derived from the Greek words for beauty and strength. We know from historical records and images from pottery, mosaics and sculptures of the period that the ancient Olympians took calisthenics training seriously. They were greatly admired – and still are, today – for their combination of athleticism and physical beauty.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                <strong>D</strong> Calisthenics experienced its second golden age in the 1800s. This century saw the birth of gymnastics, an organised sport that uses a range of bars, rings, vaulting horses and balancing beams to display physical prowess. This period is also when the phenomena of strongmen developed. These were people of astounding physical strength and development who forged nomadic careers by demonstrating outlandish feats of strength to stunned populations. Most of these men trained using hand balancing and horizontal bars, as modern weight machines had not yet been invented.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                <strong>E</strong> In the 1950s, calisthenics began to evolve again, influenced by the rise of fitness culture and the increasing popularity of bodyweight exercises. The introduction of calisthenics into schools and military training programs reinforced its importance. Today, calisthenics is not only a component of physical education but also a popular form of exercise for those seeking to develop strength and flexibility without the need for equipment.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                <strong>F</strong> In the 1960s and 1970s calisthenics and the goal of functional strength combined with physical beauty was replaced by an emphasis on huge muscles at any cost. This became the sport of bodybuilding. Although bodybuilding's pioneers were drawn from the calisthenics tradition, the sole goal soon became an increase in muscle size. Bodybuilding icons, people such as Arnold Schwarzenegger and Sergio Oliva, were called mass monsters because of their imposing physiques. Physical development of this nature was only attainable through the use of anabolic steroids, synthetic hormones which boosted muscle development while harming overall health. These bodybuilders also relied on free weights and machines, which allowed them to target and bloat the size of individual muscles rather than develop a naturally proportioned body. Calisthenics, with its emphasis on physical beauty and a balance in proportions, had little to offer the mass monsters.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                <strong>G</strong> In this “bigger is better” climate, calisthenics was relegated to groups perceived to be vulnerable, such as women, people recuperating from injuries and school students. Although some of the strongest and most physically developed human beings ever to have lived acquired their abilities through the use of sophisticated calisthenics, a great deal of this knowledge was discarded and the method was reduced to nothing more than an easily accessible and readily available activity. Those who mastered the rudimentary skills of calisthenics could expect to graduate to weight training rather than advanced calisthenics.
              </p>
              <p style={{ fontSize: '20px', fontFamily: 'Helvetica' }}>
                <strong>H</strong> In recent years, however, fitness trends have been shifting back toward the use of calisthenics. Bodybuilding approaches that promote excessive muscle development frequently lead to joint pain, injuries, unstable physiques and weak cardiovascular health. As a result, many of the newest and most popular gyms and programmes emphasise calisthenics-based methods instead. Modern practices often combine elements from a number of related traditions such as yoga, Pilates, kettle-ball training, gymnastics and traditional Greco-Roman calisthenics. Many people are keen to recover the original Greek vision of physical beauty and strength and harmony of the mind-body connection.
              </p>
            </div>
          </div>
        </td>
        <td style={{ verticalAlign: 'top', fontSize: '16px', fontFamily: 'Helvetica' }}>
        <div 
          style={{
            top: "10px",
            maxHeight: "100vh",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "white" }}
          
        >
          <p style={{ fontSize: '18px' }}>
            <strong>Questions 27–33</strong> The text has eight paragraphs, A–H. Which paragraph contains:
          </p>
          <p style={{ fontSize: '18px' }}>
            <strong>27.</strong> <input type="text" value={answers.question27} onChange={(e) => setAnswers({ ...answers, question27: e.target.value })} /> Factors influencing the survival of calisthenics throughout the ages
            <br />
            <strong>28.</strong> <input type="text" value={answers.question28} onChange={(e) => setAnswers({ ...answers, question28: e.target.value })} /> Harnessing a medical substance to increase muscle mass and strength
            <br />
            <strong>29.</strong> <input type="text" value={answers.question29} onChange={(e) => setAnswers({ ...answers, question29: e.target.value })} /> The origin of the word 'calisthenics'
            <br />
            <strong>30.</strong> <input type="text" value={answers.question30} onChange={(e) => setAnswers({ ...answers, question30: e.target.value })} /> A reference to travelling showmen who displayed their strength for audiences
            <br />
            <strong>31.</strong> <input type="text" value={answers.question31} onChange={(e) => setAnswers({ ...answers, question31: e.target.value })} /> The earliest use of calisthenics as a training method
            <br />
            <strong>32.</strong> <input type="text" value={answers.question32} onChange={(e) => setAnswers({ ...answers, question32: e.target.value })} /> The last popular supporter of calisthenics
            <br />
            <strong>33.</strong> <input type="text" value={answers.question33} onChange={(e) => setAnswers({ ...answers, question33: e.target.value })} /> A multidisciplinary approach to all-round health and strength
            <br />
          </p>

          <p style={{ fontSize: '18px' }}>
            <strong>Questions 34–40</strong> Complete the summary below. Choose NO MORE THAN TWO WORDS from the text for each answer.
          </p>
          <p style={{ fontSize: '18px' }}>
            During the sixties and seventies, attaining huge muscles became more important than <strong>35.</strong> <input type="text" value={answers.question35} onChange={(e) => setAnswers({ ...answers, question35: e.target.value })} /> strength, or having an attractive-looking body. The first people to take up this new sport of bodybuilding had a background in calisthenics but the most famous practitioners became known as <strong>36.</strong> <input type="text" value={answers.question36} onChange={(e) => setAnswers({ ...answers, question36: e.target.value })} /> on account of the impressive size of their muscles. Drugs and mechanical devices were used to develop individual muscles to a monstrous size.
          </p>
          <p style={{ fontSize: '18px' }}>
            Calisthenics then became the domain of 'weaker' people: females, children and those recovering from <strong>37.</strong> <input type="text" value={answers.question37} onChange={(e) => setAnswers({ ...answers, question37: e.target.value })} />. Much of the advanced knowledge about calisthenics was lost and the method was subsequently downgraded to the status of a simple, user-friendly activity. Once a person became skilled at this, he would progress to <strong>38.</strong> <input type="text" value={answers.question38} onChange={(e) => setAnswers({ ...answers, question38: e.target.value })} />.
          </p>
          <p style={{ fontSize: '18px' }}>
            Currently, a revival of calisthenics is underway as extreme muscle building can harm the body leaving it sore, <strong>39.</strong> <input type="text" value={answers.question39} onChange={(e) => setAnswers({ ...answers, question39: e.target.value })} />, and in poor cardiovascular health. Thus, the majority of residents want to <strong>40.</strong> <input type="text" value={answers.question40} onChange={(e) => setAnswers({ ...answers, question40: e.target.value })} /> the original Greek vision for recuperation.
          </p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</div>

  <button 
    onClick={checkAnswers} 
    disabled={isSubmitted} // Vô hiệu hóa nút nếu đã gửi
    style={{ 
      padding: '10px 20px',
      backgroundColor: isSubmitted ? '#ccc' : '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: isSubmitted ? 'not-allowed' : 'pointer'
    }}
  >
    Submit
  </button>

</div>

  );

};

export default ReadingSection;