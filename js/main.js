;(function () {
	
	'use strict';


	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	
	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}
	};

	// Parallax
	var parallax = function() {
		$(window).stellar();
	};

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 100, 'easeInOutExpo' );
					});
					
				}, 50);
				
			}

		} , { offset: '85%' } );
	};



	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};

	var pieChart = function() {
		$('.chart').easyPieChart({
			scaleColor: false,
			lineWidth: 4,
			lineCap: 'butt',
			barColor: '#9475d7',
			trackColor:	"#f5f5f5",
			size: 160,
			animate: 1000
		});
	};

	// Will show more projects when clicked
	var skillsWayPoint = function() {
		if ($('#fh5co-skills').length > 0 ) {
			$('#fh5co-skills').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( pieChart , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	var escapeHtml = function(value) {
		return String(value || '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	};

	var buildProjectCard = function(project, index) {
		var techLabel = (project.tech && project.tech.length > 0) ? escapeHtml(project.tech[0]) : 'Project';

		return [
			'<div class="col-md-4 col-sm-6">',
				'<div class="fh5co-blog project-card">',
					'<button type="button" class="project-card-trigger" data-project-index="', index, '">',
						'<span class="blog-bg" style="background-image: url(', escapeHtml(project.thumbnail), ');"></span>',
						'<div class="blog-text">',
							'<span class="posted_on">', escapeHtml(project.year), '</span>',
							'<h3>', escapeHtml(project.title), '</h3>',
							'<p>', escapeHtml(project.cardSummary), '</p>',
							'<ul class="stuff">',
								'<li>', techLabel, '</li>',
								'<li><span>View details <i class="icon-arrow-right22"></i></span></li>',
							'</ul>',
						'</div>',
					'</button>',
				'</div>',
			'</div>'
		].join('');
	};

	var renderProjectModal = function(project) {
		var $modal = $('#project-modal');
		var $media = $('#project-modal-media');
		var tagsHtml = '';
		var descriptionHtml = '';
		var highlightsHtml = '';
		var linksHtml = '';

		$('#project-modal-title').text(project.title || '');
		$('#project-modal-year').text(project.year || '');
		$('#project-modal-summary').text(project.summary || '');

		if (project.media) {
			$media.attr('src', project.media);
			$media.attr('alt', project.title || 'Project media');
			$media.show();
		} else {
			$media.hide();
		}

		if (project.tech && project.tech.length) {
			tagsHtml = project.tech.map(function(item) {
				return '<span class="project-tag">' + escapeHtml(item) + '</span>';
			}).join('');
		}
		$('#project-modal-tags').html(tagsHtml);

		if (project.description && project.description.length) {
			descriptionHtml = project.description.map(function(paragraph) {
				return '<p>' + escapeHtml(paragraph) + '</p>';
			}).join('');
		}
		$('#project-modal-description').html(descriptionHtml);

		if (project.highlights && project.highlights.length) {
			highlightsHtml = project.highlights.map(function(item) {
				return '<li>' + escapeHtml(item) + '</li>';
			}).join('');
		}
		$('#project-modal-highlights').html(highlightsHtml);

		if (project.github) {
			linksHtml += '<a class="btn btn-primary btn-sm project-link-btn" href="' + escapeHtml(project.github) + '" target="_blank" rel="noopener">GitHub</a>';
		}
		if (project.demo) {
			linksHtml += '<a class="btn btn-default btn-sm project-link-btn" href="' + escapeHtml(project.demo) + '" target="_blank" rel="noopener">Live Demo</a>';
		}
		$('#project-modal-links').html(linksHtml);

		$modal.modal('show');
	};

	var loadProjects = function() {
		var $projectsGrid = $('#projects-grid');

		if ($projectsGrid.length === 0) {
			return;
		}

		fetch('data/projects.json')
			.then(function(response) {
				if (!response.ok) {
					throw new Error('Unable to load projects.json');
				}
				return response.json();
			})
			.then(function(projects) {
				var cardsHtml = projects.map(function(project, index) {
					return buildProjectCard(project, index);
				}).join('');

				$projectsGrid.html(cardsHtml);
				$projectsGrid.on('click', '.project-card-trigger', function() {
					var projectIndex = parseInt($(this).attr('data-project-index'), 10);
					renderProjectModal(projects[projectIndex]);
				});
			})
			.catch(function() {
				$projectsGrid.html(
					'<div class="col-md-12 text-center">' +
						'<p class="projects-error">Projects could not be loaded. Please check <code>data/projects.json</code>.</p>' +
					'</div>'
				);
			});
	};

	
	$(function(){
		loadProjects();
		contentWayPoint();
		goToTop();
		loaderPage();
		fullHeight();
		parallax();
		// pieChart();
		skillsWayPoint();
	});


}());
