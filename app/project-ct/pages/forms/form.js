import Link from 'next/link';

export default function FirstPost() {
  return (
    <>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
      <h3>Shambala Music Festival Patient Encounter Form</h3>
      <form action="/send-data-here" method="post">
        <div class="row-outer">
          <div class="col">
            <div class="row-inner">
              <article class="item">
                <label for="date">Date</label>
                <input type="Date" id="date" name="date" />
                <label for="time">Time:</label>
                <input type="time" id="time" name="time" />
              </article>
            </div>
            <div class="row-inner">
              <article>
                <h4>Triage Acuity:</h4>
                <label for="white">White</label>
                <input type="radio" name="acuity" value="white" />
                <label for="white">Green</label>
                <input type="radio" name="acuity" value="green" />
                <label for="white">Yellow</label>
                <input type="radio" name="acuity" value="yellow" />
                <label for="white">Red</label>
                <input type="radio" name="acuity" value="red" />
              </article>
            </div>
            <div class="row-inner">
              <article>
                <h4>Patient Occupation:</h4>
                <input type="radio" name="occupation" value="staff" />
                <label for="white">Event Staff</label>
                <input type="radio" name="occupation" value="performer" />
                <label for="white">Performer</label>
                <input type="radio" name="occupation" value="spectator" />
                <label for="white">Spectator</label>
                <input type="radio" name="occupation" value="unknown" />
                <label for="white">Unknown</label>
              </article>
            </div>
            <div class="row-inner">
              <h4 for="complaints">Chief Complaint:</h4>
              <select name="chief-complaint" id="complaints">
              <option value="prompt">--Please Select--</option>
                <option value="nausea">Nausea/Vomiting</option>
                <option value="saab">Dizziness/Presyncope/Lightheaded</option>
                <option value="opel">Loss of Consciousness</option>
                <option value="audi">Seizure</option>
                <option value="audi">Adverse Drug Effect </option>
                <option value="audi">Agitation</option>
                <option value="audi">Bizarre Behaviour</option>
                <option value="audi">Hallucinations</option>
                <option value="audi">Anxiety</option>
                <option value="audi">Abdominal Pain</option>
                <option value="audi">Chest Pain</option>
                <option value="audi">Headache</option>
                <option value="audi">Other Pain</option>
                <option value="audi">Shortness of Breath</option>
                <option value="audi"> Allergic Reaction</option>
                <option value="audi">Trauma</option>
              </select>
              <label for="other">Other: </label>
              <input type="text"></input>
            </div>
            <div class="row-inner">
                <h4>Arrival Method:</h4>
              <input type="radio" name="arrival-method" value="self-presented" />
              <label for="white">Self Presented</label>
              <input type="radio" name="arrival-method" value="med-transport" />
              <label for="white">Medical Transport</label>
              <input type="radio" name="arrival-method" value="security" />
              <label for="white">Brought by Security</label>
              <input type="radio" name="arrival-method" value="harm-reduction" />
              <label for="white">Brought by Harm Reduction</label>
              <input type="radio" name="arrival-method" value="other" />
              <label for="white">Other: </label>
              <input type="text"></input>
            </div>
            <div class="row-inner">
              <article>
                <label for="handover">Handover from: </label>
                <input type="text"></input>
              </article>
            </div>
          </div>
          <div class="col">
          </div>
        </div>
      </form>
    </>
  );
}