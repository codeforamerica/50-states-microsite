const programNames = ['SNAP', 'Medicaid', 'TANF', 'WIC', 'LIHEAP'];

// Colors: also repeated as CSS variables. Used in JS so that color transitions work properly.
const backgroundColor = '#fff';
const primaryTextColor = '#000';
const availableColor = '#0D77AC'; // blue from CfA website
const availableColorLighter = '#C1D6E4';
const unavailableColor = '#d8d8d8';
const unavailableColorLighter = '#ddd';

// State abbreviation plus tilemap grid co-ordinates
const stateInfo = [
  ['Alabama', { key: 'AL', x: 6, y: 6 }],
  ['Alaska', { key: 'AK', x: 0, y: 0 }],
  ['Arizona', { key: 'AZ', x: 2, y: 5 }],
  ['Arkansas', { key: 'AR', x: 5, y: 5 }],
  ['California', { key: 'CA', x: 0, y: 4 }],
  ['Colorado', { key: 'CO', x: 3, y: 4 }],
  ['Connecticut', { key: 'CT', x: 10, y: 2 }],
  ['Delaware', { key: 'DE', x: 10, y: 4 }],
  ['Florida', { key: 'FL', x: 7, y: 7 }],
  ['Georgia', { key: 'GA', x: 7, y: 6 }],
  ['Hawaii', { key: 'HI', x: 0, y: 7 }],
  ['Idaho', { key: 'ID', x: 2, y: 3 }],
  ['Illinois', { key: 'IL', x: 6, y: 3 }],
  ['Indiana', { key: 'IN', x: 7, y: 3 }],
  ['Iowa', { key: 'IA', x: 5, y: 3 }],
  ['Kansas', { key: 'KS', x: 4, y: 4 }],
  ['Kentucky', { key: 'KY', x: 6, y: 4 }],
  ['Louisiana', { key: 'LA', x: 4, y: 6 }],
  ['Maine', { key: 'ME', x: 11, y: 0 }],
  ['Maryland', { key: 'MD', x: 9, y: 4 }],
  ['Massachusetts', { key: 'MA', x: 11, y: 1 }],
  ['Michigan', { key: 'MI', x: 7, y: 2 }],
  ['Minnesota', { key: 'MN', x: 5, y: 2 }],
  ['Mississippi', { key: 'MS', x: 5, y: 6 }],
  ['Missouri', { key: 'MO', x: 5, y: 4 }],
  ['Montana', { key: 'MT', x: 2, y: 2 }],
  ['Nebraska', { key: 'NE', x: 4, y: 3 }],
  ['Nevada', { key: 'NV', x: 1, y: 4 }],
  ['New Hampshire', { key: 'NH', x: 10, y: 1 }],
  ['New Jersey', { key: 'NJ', x: 10, y: 3 }],
  ['New Mexico', { key: 'NM', x: 3, y: 5 }],
  ['New York', { key: 'NY', x: 9, y: 2 }],
  ['North Carolina', { key: 'NC', x: 8, y: 5 }],
  ['North Dakota', { key: 'ND', x: 3, y: 2 }],
  ['Ohio', { key: 'OH', x: 8, y: 3 }],
  ['Oklahoma', { key: 'OK', x: 4, y: 5 }],
  ['Oregon', { key: 'OR', x: 1, y: 3 }],
  ['Pennsylvania', { key: 'PA', x: 9, y: 3 }],
  ['Rhode Island', { key: 'RI', x: 11, y: 2 }],
  ['South Carolina', { key: 'SC', x: 8, y: 6 }],
  ['South Dakota', { key: 'SD', x: 4, y: 2 }],
  ['Tennessee', { key: 'TN', x: 6, y: 5 }],
  ['Texas', { key: 'TX', x: 3, y: 6 }],
  ['Utah', { key: 'UT', x: 2, y: 4 }],
  ['Vermont', { key: 'VT', x: 9, y: 1 }],
  ['Virginia', { key: 'VA', x: 7, y: 5 }],
  ['Washington', { key: 'WA', x: 1, y: 2 }],
  ['West Virginia', { key: 'WV', x: 7, y: 4 }],
  ['Wisconsin', { key: 'WI', x: 6, y: 2 }],
  ['Wyoming', { key: 'WY', x: 3, y: 3 }]
];

const fiftyStates = new Map(stateInfo);
d3.select('#state-select')
  .selectAll('option')
  .data([...fiftyStates.keys()].sort())
  .enter().append('option')
  .attr('value', d => d)
  .attr('selected', (d, i) => i === 0 ? 'selected' : null)
  .text(d => d);

function parseYesNo(entry) {
  if (entry.slice(0, 3) === 'Yes') {
    return 'Yes';
  } else if (entry.slice(0, 2) === 'No') {
    return 'No';
  } else {
    return 'N/A';
  }
}

function parseYesNoOptional(entry) {
  if (entry.slice(0, 8) === 'Optional') {
    return 'Optional';
  } else {
    return parseYesNo(entry);
  }
}

function kebabCase(str) {
  if (typeof str == 'function') {
    str = str();
  }
  return str.match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)
            .filter(Boolean)
            .map(x => x.toLowerCase())
            .join('-')
}

function screenshots(site) {
  const state = kebabCase(site.state);
  const beginning = 'https://ibi-screenshots.s3.amazonaws.com/screenshots/'+kebabCase(site.state)+'-'+kebabCase(site.site)+'-';
  let screenshots = [];
  for (i = 1; i <= site.screenshotCount; i++) {
    screenshots.push({img: beginning+i.toString().padStart(3, '0')+'.png'});
  }
  return screenshots;
}

d3.csv('static/50-states-landscape-analysis.csv', d => {
  const programStatus = {
    snap: parseYesNo(d['Apply online for SNAP?']),
    medicaid: parseYesNo(d['Apply online for Medicaid?']),
    tanf: parseYesNo(d['Apply online for TANF?']),
    wic: parseYesNo(d['Apply online for WIC?']),
    liheap: parseYesNo(d['Apply online for LiHEAP?'])
  };
  const programsAvailable = programNames.filter(p => programStatus[p.toLowerCase()] === 'Yes');
  return {
    state: d['State'],
    site: d['Application / Portal Name'],
    identifier: d['Application / Portal Name'] + ' (' + d['State'] + ') ' + programsAvailable.join('-'),
    idProofing: parseYesNoOptional(d['Identity Proofing? Yes/No/Optional']),
    programStatus: programStatus,
    programsAvailable: programsAvailable,
    programsAvailableStr: programsAvailable.join(' + '),
    programCount: programsAvailable.length,
    responsive: parseYesNo(d['Is the application mobile responsive?']),
    screens: Number(d['How many screens to complete an application workflow']) || 0,
    time: Number(d['How long does it take to complete an application with standard family on desktop?']) || 0,
    loginRequired: parseYesNo(d['Does the application require a user name/password before starting the application?']),
    screenshotCount: Number(d['Number of screenshots']) || 0
  }
}).then(drawVisualizations);

function drawVisualizations(csv) {
  // Filter the data so that we only have rows with actual state names (e.g. excluding "New York City")
  const stateSites = csv.filter(row => fiftyStates.has(row.state));

  // Nest the data by state
  const byState = d3.nest()
    .key(d => d.state)
    .entries(stateSites);

  byState.forEach(state => {
    // Program status at the state level. Retain all programs and keep them in the same order for each state.
    state.programs = programNames.map(p => ({
      name: p,
      label: p.slice(0, 1),
      online: state.values.some(d => d.programStatus[p.toLowerCase()] === 'Yes')
    }));
    state.programCount = state.programs.filter(p => p.online).length;
  });

  drawGlyphs(byState);


  const selected = d3.select('#state-select').property('value');
  const selectedState = byState.find(d => d.key === selected);
  drawScorecard(selectedState);

  const programSummary = d3.nest()
    .key(d => d.name)
    .key(d => d.online)
    .rollup(values => values.length)
    .entries(d3.merge(byState.map(state => state.programs)))
  drawPieCharts(programSummary, d3.select('#program-summary'), 'states');

  const siteSummary = d3.nest()
    .key(d => d.key)
    .key(d => d.value)
    .rollup(values => values.length)
    .entries(d3.merge(stateSites.map(d => [
      { key: 'No ID proofing', value: d.idProofing !== 'Yes' }, // Empty cell or N/A or "Optional" is counted as true
      { key: 'Start without login', value: d.loginRequired !== 'Yes' }, // Empty cell or N/A is counted as true
      { key: 'Responsive', value: d.responsive === 'Yes' }
    ])));

  // Focus specifically on states with the big three programs
  const bigThree = ['SNAP', 'Medicaid', 'TANF'];
  const smtStates = d3.nest()
    .key(d => d.state)
    .entries(stateSites)
    .filter(state => {
      // Filter to include only states that (across all sites) offer *all* of the big three, and *only* those three
      const allPrograms = [...new Set(d3.merge(state.values.map(d => d.programsAvailable)))];
      return bigThree.every(d => allPrograms.some(p => p === d)) && allPrograms.length === bigThree.length;
    });
  smtStates.forEach(state => {
    const allPrograms = d3.merge(state.values.map(d => d.programsAvailable));
    if (allPrograms.length > bigThree.length) {
      // There is duplication of services across the sites; for now, keep only the fastest
      console.log('Duplication of services across ' + state.key + ' sites; keeping only the fastest');
      state.values.sort((a, b) => d3.ascending(a.time, b.time)).splice(1); // Remove all but the first
      state.key = state.key + ' (' + state.values[0].site + ')';
    }
    state.totalTime = d3.sum(state.values, d => d.time);
  });

  d3.select('#state-select').on('change', () => {
    const selected = d3.select('#state-select').property('value');
    const state = byState.find(d => d.key === selected);
    drawScorecard(state);
  });

  d3.select('.scorecard__control--next').on('click', () => {
    var isLastElementSelected = $('#state-select > option:selected').index() == $('#state-select > option').length -1;
    if (!isLastElementSelected) {     
      $('#state-select > option:selected').next('option').prop('selected', 'selected'); 
    } 
    else {
      $('#state-select > option').first().prop('selected', 'selected'); 
    }
    const selected = d3.select('#state-select').property('value');
    const state = byState.find(d => d.key === selected);
    drawScorecard(state);
  });

  d3.select('.scorecard__control--previous').on('click', () => {
    var isFirstElementSelected = $('#state-select > option:selected').index() == 0;
    if (!isFirstElementSelected) {
      $('#state-select > option:selected').prev('option').prop('selected', 'selected');
    } 
    else {
      $('#state-select > option').last().prop('selected', 'selected'); 
    }
    const selected = d3.select('#state-select').property('value');
    const state = byState.find(d => d.key === selected);
    drawScorecard(state);
  });
}

function drawPieCharts(summaryData, div, valueSuffix = '') {

  const programOrder = ['medicaid','snap','tanf','wic','liheap']

  const summary = div.selectAll('.summary')
    .data(summaryData)
    .enter().append('div')
    .attr('class', 'pies__item')
    .sort((a, b) => d3.ascending(
      programOrder.indexOf(a.key.toLowerCase()),
      programOrder.indexOf(b.key.toLowerCase())
    ))
    .append('svg').attr('width', '100%').attr('height', '100%');

  const width = parseInt(summary.style('width')) || 0;
  const height = parseInt(summary.style('height')) || 0;
  const radius = Math.min(width, height) / 2;

  const pie = d3.pie()
    .value(d => d.value)
    .sort((a, b) => d3.descending(a.key, b.key));

  const arc = d3.arc()
    .innerRadius(radius * 0.8)
    .outerRadius(radius);

  const g = summary.append('g')
    .attr('transform', `translate(${radius},${radius})`);

  g.selectAll('path')
    .data(d => pie(d.values))
    .enter().append('path')
    .attr('d', d => arc(d))
    .attr('class', d => d.data.key === 'true' ? 'pies__item--available' : 'pies__item--unavailable');

  g.append('text')
    .attr('class', 'pies__item-name')
    .text(d => d.key)
    .attr('dy', '-0.25em')
    .attr('text-anchor', 'middle');

  g.append('text')
    .attr('class', 'value')
    .text(d => (d.values.find(v => v.key === 'true').value || 0) + ' ' + valueSuffix)
    .attr('dy', '1.25em')
    .attr('text-anchor', 'middle');
}

function drawSingleGlyph(state, g, width, height) {

  const center = { x: width / 2, y: height / 2 };
  const glyphRadius = Math.round(height / 3);
  const circleRadius = Math.round(glyphRadius / 4);
  function pentagonVertex(i) {
    const angle = i / 5 * Math.PI * 2 + 1.1 * Math.PI;
    return {
      x: Math.cos(angle) * glyphRadius + center.x,
      y: Math.sin(angle) * glyphRadius + center.y
    };
  }

  const integration = g.selectAll('.integration')
    .data(state.values.filter(site => site.programCount > 1))
    .enter().append('g')
    .attr('class', 'integration');

  integration.append('path')
    .attr('d', site => {
      const points = Object.values(site.programStatus).map((p, i) => {
        return p === 'Yes' ? pentagonVertex(i) : null;
      }).filter(p => p);
      if (points.length === 2) {
        // draw a line
        return 'M' + points.map(p => [p.x, p.y].join(',')).join('L');
      } else {
        // draw a polygon
        return 'M' + points.map(p => [p.x, p.y].join(',')).join('L') + 'Z';
      }
    })
    .attr('fill', site => site.programCount > 2 ? availableColorLighter : 'none')
    .attr('stroke', site => site.programCount > 2 ? 'none' : availableColorLighter)
    .attr('stroke-width', circleRadius * 2);

  const program = g.selectAll('.program')
    .data(state.programs)
    .enter().append('g')
    .attr('class', 'program')
    .attr('transform', (d, i) => {
      const v = pentagonVertex(i);
      return `translate(${v.x},${v.y})`;
    });

  program.append('circle')
    .attr('r', circleRadius)
    .style('fill', d => d.online ? availableColor : unavailableColor)
    .style('stroke', d => d.online ? 'none' : unavailableColor);

  program.append('text')
    .text(d => d.label)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('class', 'label')
    .style('fill', d => d.online ? backgroundColor : backgroundColor)
    .style('font-size', (circleRadius + 3) + 'px');
}

// Draw each glyph in its own div, and leave it up to CSS to lay them out
function drawGlyphs(states) {
  const glyph = d3.select('#glyphs')
    .selectAll('.glyph')
    .data(states)
    .enter().append('div')
    .attr('class', 'glyph')
    // Add the state name as a data field to each glyph container
    .attr('data-state', d => d.key)
    // Add all included programs, separated by a comma, as a data property to each glyph container
    .attr('data-programs', d => {
      let onlinePrograms = [];
      for (var i = 0; i < d.programs.length; i++) {
        if (d.programs[i].online) {
          onlinePrograms.push(d.programs[i].name.toLowerCase())
        }
      }
      return onlinePrograms.sort().join(',')
    })
    // Add the program count as a data property to each glyph container
    .attr('data-online-programs-count', d => {
      let onlineProgramsCount = 0;
      for (var i = 0; i < d.programs.length; i++) {
        if (d.programs[i].online) {
          onlineProgramsCount++;
        }
      }
      return onlineProgramsCount;
    })
    // Add the max number of programs that are combined on one platform as a data property on each glyph container
    .attr('data-most-combined-count', d => {
      let siteProgramCounts = [1];
      for (var i = 0; i < d.values.length; i++) {
        siteProgramCounts.push(d.values[i].programCount);
      }
      var mostCombined = siteProgramCounts.reduce(function(a, b) {
        return Math.max(a, b);
      });
      return mostCombined;
    })
    .append('svg').attr('width', '100%').attr('height', '100%');

  const width = parseInt(glyph.style('width')) || 0;
  const height = parseInt(glyph.style('height')) || 0;
  const topMargin = 15;

  glyph.each(function (d) {
    const g = d3.select(this).append('g');
    g.attr('transform', `translate(0, ${topMargin})`);
    g.append('text')
      .attr('x', width / 2)
      .attr('text-anchor', 'middle')
      .text(d.key);
    drawSingleGlyph(d, g, width, height);
  });
}

function drawScorecard(state) {
  // TODO: clean up this code so that it's more efficient and less repetitive
  d3.select('#scorecard').selectAll('*').remove();
  const scorecardContainer = d3.select('#scorecard').datum(state);
  const scorecardRow = scorecardContainer.append('div').attr('class','row center-md');
  const scorecardCol = scorecardRow.append('div').attr('class', d => {
    const siteCount = d.values.length;
    const containerWidth = siteCount === 3 ? 'col-xs-12' : 'col-xs-12 col-md-8';
    return containerWidth;
  });
  const scorecard = scorecardCol.append('div').attr('class','scorecard');
  const scorecardHeader = scorecard.append('div').attr('class', 'scorecard__header');
  scorecardHeader.append('h3').attr('class', 'scorecard__title').text(d => d.key);
  scorecardHeader.append('p').attr('class', 'scorecard__subtitle').text(d => {
    const siteCount = d.values.length;
    const siteLabel = siteCount === 1 ? 'site' : 'sites';
    const programLabel = d.programCount === 1 ? 'program' : 'programs';
    return `${siteCount} ${siteLabel}, ${d.programCount} ${programLabel}`;
  });
  const glyph = scorecardHeader.append('div').attr('class', 'scorecard__glyph').append('svg').attr('width', '130').attr('height', '130');
  const glyphWidth = parseInt(glyph.style('width')) || 0;
  const glyphHeight = parseInt(glyph.style('height')) || 0;
  drawSingleGlyph(state, glyph.append('g'), glyphWidth, glyphHeight);
  const site = scorecard.append('div').attr('class', 'scorecard__body').selectAll('.scorecard__body')
    .data(d => d.values).enter().append('div').attr('class', 'scorecard__panel');
  const overview = site.append('div').attr('class', 'scorecard__overview');
  overview.append('div').attr('class', 'scorecard__website-name').text(d => d.site);
  overview.append('div').attr('class', 'scorecard__website-programs').selectAll('span').data(d => {
    return programNames.map(p => ({
      label: p,
      available: d.programStatus[p.toLowerCase()] === 'Yes'
    }))
  }).enter().append('span')
    .text(d => d.label + ' ')
    .attr('class', d => 'scorecard__website-program scorecard__website-program--' + (d.available ? 'available' : 'unavailable'));

  const stats = overview.append('div').attr('class', 'scorecard-site-stats');
  let group = stats.append('div').attr('class', 'scorecard__stats');
  let stat = group.append('div').attr('class', 'scorecard__stat');
  stat.append('div').attr('class', 'scorecard__stat-number').text(d => {
    if (d.time === 0) { return '--*'; }
    return d.time
  });
  stat.append('div').attr('class', 'scorecard__stat-label').html('Minutes to <br>complete');
  stat = group.append('div').attr('class', 'scorecard__stat');
  stat.append('div').attr('class', 'scorecard__stat-number').text(d => {
    if (d.screens === 0) { return '--*'; }
    return d.screens
  });
  stat.append('div').attr('class', 'scorecard__stat-label').html('Number of <br>screens');

  drawGallery(site.data());
  
  let checklist = site.append('ul').attr('class', 'scorecard__checklist');
  let checklistItem = checklist.append('li');
  checklistItem.append('span').attr('class','scorecard__checklist-label').text('No ID proofing required?');
  checklistItem.append('i').attr('class', d => 'scorecard__icon scorecard__icon--' + (d.idProofing === 'Yes' ? 'no' : 'yes'));
  checklistItem.append('i').attr('class', d => 'scorecard__icon scorecard__icon--info').attr('title','About 85% of applications do not require ID proofing.');
  
  checklistItem = checklist.append('li');
  checklistItem.append('span').attr('class','scorecard__checklist-label').text('Mobile friendly?');
  checklistItem.append('i').attr('class', d => 'scorecard__icon scorecard__icon--' + (d.responsive === 'Yes' ? 'yes' : 'no'));
  checklistItem.append('i').attr('class', d => 'scorecard__icon scorecard__icon--info').attr('title','About 40% of applications are mobile-friendly.');

  checklistItem = checklist.append('li');
  checklistItem.append('span').attr('class','scorecard__checklist-label').text('No registration required?');
  checklistItem.append('i').attr('class', d => 'scorecard__icon scorecard__icon--' + (d.loginRequired === 'Yes' ? 'no' : 'yes'));
  checklistItem.append('i').attr('class', d => 'scorecard__icon scorecard__icon--info').attr('title','About 25% of applications do not require registration.');

  stats.append('div').attr('class', 'scorecard__footnote').text(d => {
    if (d.screens === 0) { return '* Unavailable'; }
    return ''
  });

  $('#scorecard .scorecard__icon--info').tooltipster({
    theme: 'tooltipster-borderless'
  });

}

function drawGallery(sites) {
  $('.gallery__header').remove();
  $('.fotorama').remove();
  sites.forEach(function(site) {
    let siteName = kebabCase(site.site);
    console.log(site);
    $('#gallery').append('<h3 class="h3 text-center gallery__header">Explore '+site.site+ ' (' + site.programsAvailableStr + ') screen by screen</h3><div class="row center-md"><div class="col-xs-12 col-md-10"><div class="fotorama" id="gallery--'+siteName+'" data-auto="true"></div></div></div>');

    $('#gallery--'+kebabCase(siteName)).fotorama({
      auto: true,
      allowfullscreen: true,
      transition: "crossfade",
      nav: "dots",
      arrows: "always",
      width: "100%",
      transitionDuration: 0,
      data: (screenshots(site))
    });
  });
}

$(document).ready(function() {

  // Time to complete chart

  var completionTimeData = null;
  $.ajax({
    'async': false,
    'global': false,
    'url': "static/completion-time.json",
    'dataType': "json",
    'success': function (data) {
      completionTimeData = data;
    }
  });

  $(completionTimeData).each(function(i, stateData){

    var statePrograms = [];
    $(stateData.platforms).each(function(j, platform){
      statePrograms = statePrograms.concat(platform.programs);
    });
    var stateGroup = (statePrograms.sort()).join('_').toLowerCase();

    var row = $('<div class="chart__row" />').appendTo($('#' + stateGroup).find('.chart__rows'));
    $('<div />',{
      class: 'chart__axis ' + (typeof stateData.footnote !== 'undefined' ? 'chart__axis--has-footnote' : ''),
      title: typeof stateData.footnote !== 'undefined' ? stateData.footnote : '',
      text: stateData.state,
    }).appendTo(row);
    var stateTotal = 0;
    $(stateData.platforms).each(function(j, platform){
      stateTotal += platform.minutes;
      var programsStr = platform.programs.join(' + ');
      var programsLetters = platform.programs.map((program) => program[0]).join(' + ');
      $('<div />',{
        class: 'chart__bar',
        html: '<span class="chart__bar-label">' + programsLetters  + '</span>',
        title: programsStr + ': ' + platform.minutes + ' minutes',
        style: 'width: ' + platform.minutes / 120 * 65 + '%'
      }).tooltipster({theme: 'tooltipster-borderless'}).appendTo(row);
    });
    if (stateTotal > 0){
      $(row).attr('data-state-total', stateTotal).append('<div class="chart__row-total">' + stateTotal + ' min</div>');
    }
  });

  // Sort time to complete rows by total ascending
  $('#time-to-complete-chart .chart__rows').each(function(){
    var reorderedRows = $(this).find('.chart__row').sort(function(a, b) {
      return +a.getAttribute('data-state-total') - +b.getAttribute('data-state-total');
    });
    $(reorderedRows).appendTo(this);
  });

  // Time to complete chart 'show more' button
  $('#time-to-complete-chart .chart__group').hide();
  $('#time-to-complete-chart .chart__group:lt(4) ').show();
  $('#time-to-complete-chart .chart__show-more .button').click(function(event){
    event.preventDefault();
    $('#time-to-complete-chart .chart__show-more').fadeOut(500);
    $('#time-to-complete-chart .chart__group:not(:lt(4))')
      .slideDown(1000, function(){
        $(this).find('.chart__row').animate(
          { opacity: 1 },
          { queue: false, duration: '500' })
      })
      .find('.chart__row').css('opacity', 0);
    $('#time-to-complete-chart .chart__footnotes').fadeIn();
  });

  // Time to complete chart footnotes
  $('#time-to-complete-chart').find('.chart__axis--has-footnote').each(function(i){
    $(this).append('<sup>' + (i + 1) + '</sup>');
    $('.chart__footnotes').append('<strong>' + (i + 1) + '</strong> ' + $(this).attr('title') + '<br>');
  });
  $('#time-to-complete-chart .chart__footnotes').hide();

  // Filter controls for 'combined' panel
  $('#combined-filters input').change(function(){
    
    // Make a list of all the selected programs
    let selectedPrograms = [];
    $('#combined-filters input:checked').each(function(){
      selectedPrograms.push($(this).attr('name'));
    });

    // Show all the glyphs
    $('#glyphs .glyph').show();

    // Cycle through the selected programs and hide any glyphs that don't include those programs
    for (var i = 0; i < selectedPrograms.length; i++) {
      $('#glyphs .glyph:not([data-programs*="' + selectedPrograms[i] + '"])' ).hide();
    }
  });

  // Sort control for 'combined' panel
  $('#combined-sort select').change(function(){
    let sortBy = $("#combined-sort select option:selected").attr('value');
    switch(sortBy){

      case 'state':
        $('#glyphs .glyph').sort(function(a, b) {
          return $(b).data('state').toLowerCase() < $(a).data('state').toLowerCase() ? 1 : -1;
        }).appendTo('#glyphs');
        break;

      case 'combined':
        $('#glyphs .glyph').sort(function(a, b) {
          return $(b).data('most-combined-count') - $(a).data('most-combined-count');
        }).appendTo('#glyphs');
        break;

      case 'online':
        $('#glyphs .glyph').sort(function(a, b) {
          return $(b).data('online-programs-count') - $(a).data('online-programs-count');
        }).appendTo('#glyphs');
        break;
    }
  });

  // Tooltipster (tooltips)
  $('.tooltip').tooltipster({
    theme: 'tooltipster-borderless'
  });

  // 

});
