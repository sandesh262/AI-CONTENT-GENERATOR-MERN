const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Template data (similar to your Next.js app's Templates.tsx)
const templates = [
    {
        name: 'Blog Title Generator',
        desc: 'AI-powered tool that generates engaging, SEO-optimized blog titles based on your content outline or description',
        category: 'Blog',
        icon: 'https://cdn-icons-png.flaticon.com/128/4186/4186534.png',
        aiPrompt: 'Generate 10 compelling, SEO-friendly blog titles based on the provided niche and outline. Include a mix of how-to, listicle, and question-based titles. Format the output in rich text editor format.',
        slug: 'generate-blog-title',
        form: [
            {
                label: 'Enter your blog niche',
                field: 'input',
                name: 'niche',
                required: true,
                placeholder: 'e.g., Digital Marketing, Personal Finance, Health & Wellness'
            },
            {
                label: 'Enter blog outlines (optional)',
                field: 'textarea',
                name: 'outline',
                placeholder: 'Add key points you want to cover in your blog'
            }
        ]
    },
    {
        name: 'Blog Outline Generator',
        desc: 'Create comprehensive, well-structured blog outlines with AI assistance',
        category: 'Blog',
        icon: 'https://cdn-icons-png.flaticon.com/128/2593/2593549.png',
        aiPrompt: 'Generate a detailed, hierarchical blog outline with main points, subpoints, and suggested word count for each section. Include an introduction and conclusion. Format in rich text editor style.',
        slug: 'generate-blog-outline',
        form: [
            {
                label: 'Enter your blog niche',
                field: 'input',
                name: 'niche',
                required: true,
                placeholder: 'e.g., Technology, Fitness, Business'
            },
            {
                label: 'Enter your blog topic',
                field: 'textarea',
                name: 'topic',
                required: true,
                placeholder: 'Describe what you want to write about'
            },
            {
                label: 'Target word count',
                field: 'input',
                name: 'wordCount',
                type: 'number',
                placeholder: 'e.g., 1500'
            }
        ]
    },
    {
        name: 'Content Generator',
        desc: 'AI tool that generates high-quality, engaging content based on your outline or topic',
        category: 'Blog',
        icon: 'https://cdn-icons-png.flaticon.com/128/9079/9079294.png',
        aiPrompt: 'Generate detailed, well-researched content with proper headings, subheadings, and natural paragraph flows. Include relevant examples and maintain a consistent tone. Format in rich text editor style.',
        slug: 'generate-content',
        form: [
            {
                label: 'Enter your content topic',
                field: 'input',
                name: 'topic',
                required: true,
                placeholder: 'Target topic or title of your content'
            },
            {
                label: 'Content outline',
                field: 'textarea',
                name: 'outline',
                placeholder: 'Provide a basic structure or key points to cover'
            },
            {
                label: 'Tone of voice',
                field: 'input',
                name: 'tone',
                placeholder: 'e.g., Professional, Casual, Educational'
            },
            {
                label: 'Target word count',
                field: 'input',
                name: 'wordCount',
                type: 'number',
                placeholder: 'e.g., 1500'
            }
        ]
    },
    // SEO Templates
    {
        name: 'SEO Meta Description Generator',
        desc: 'Create compelling meta descriptions that improve click-through rates',
        category: 'SEO',
        icon: 'https://cdn-icons-png.flaticon.com/128/1378/1378598.png',
        aiPrompt: 'Generate 5 SEO-optimized meta descriptions (150-160 characters each) that include the target keyword and encourage clicks. Format in rich text editor style.',
        slug: 'generate-meta-description',
        form: [
            {
                label: 'Page Title',
                field: 'input',
                name: 'title',
                required: true,
                placeholder: 'Enter the title of your page'
            },
            {
                label: 'Target Keyword',
                field: 'input',
                name: 'keyword',
                required: true,
                placeholder: 'Main keyword to include'
            },
            {
                label: 'Page Content Summary',
                field: 'textarea',
                name: 'content',
                placeholder: 'Brief summary of your page content'
            }
        ]
    },
    
    // Social Media Templates
    {
        name: 'Instagram Caption Generator',
        desc: 'Create engaging, attention-grabbing Instagram captions that increase engagement',
        category: 'Social Media',
        icon: 'https://cdn-icons-png.flaticon.com/128/174/174855.png',
        aiPrompt: 'Generate 5 engaging Instagram captions with relevant hashtags based on the provided details. Include emojis and make them attention-grabbing. Format in rich text editor style.',
        slug: 'generate-instagram-caption',
        form: [
            {
                label: 'What is your post about?',
                field: 'textarea',
                name: 'postContent',
                required: true,
                placeholder: 'Describe your photo or video content'
            },
            {
                label: 'Brand or Personal Account?',
                field: 'input',
                name: 'accountType',
                placeholder: 'e.g., Brand, Personal, Influencer'
            },
            {
                label: 'Tone of voice',
                field: 'input',
                name: 'tone',
                placeholder: 'e.g., Casual, Professional, Funny, Inspirational'
            },
            {
                label: 'Include hashtags?',
                field: 'input',
                name: 'hashtags',
                placeholder: 'How many hashtags? (e.g., 5-10)'
            }
        ]
    },
    {
        name: 'Twitter/X Post Generator',
        desc: 'Create concise, engaging tweets that drive engagement and shares',
        category: 'Social Media',
        icon: 'https://cdn-icons-png.flaticon.com/128/5969/5969020.png',
        aiPrompt: 'Generate 5 engaging Twitter/X posts under 280 characters that include relevant hashtags and encourage engagement. Format in rich text editor style.',
        slug: 'generate-twitter-post',
        form: [
            {
                label: 'What do you want to post about?',
                field: 'textarea',
                name: 'topic',
                required: true,
                placeholder: 'Describe your topic or message'
            },
            {
                label: 'Include hashtags?',
                field: 'input',
                name: 'hashtags',
                placeholder: 'How many hashtags? (e.g., 1-3)'
            },
            {
                label: 'Tone of voice',
                field: 'input',
                name: 'tone',
                placeholder: 'e.g., Professional, Conversational, Humorous'
            }
        ]
    },
    {
        name: 'LinkedIn Post Generator',
        desc: 'Create professional, thought-leadership content for LinkedIn',
        category: 'Social Media',
        icon: 'https://cdn-icons-png.flaticon.com/128/3536/3536505.png',
        aiPrompt: 'Generate 3 professional LinkedIn posts that position the author as a thought leader. Include appropriate hashtags and a call to action. Format in rich text editor style.',
        slug: 'generate-linkedin-post',
        form: [
            {
                label: 'Topic or Industry',
                field: 'input',
                name: 'industry',
                required: true,
                placeholder: 'e.g., Marketing, Technology, Finance'
            },
            {
                label: 'Key message or insight',
                field: 'textarea',
                name: 'message',
                required: true,
                placeholder: 'What professional insight do you want to share?'
            },
            {
                label: 'Include call to action?',
                field: 'input',
                name: 'cta',
                placeholder: 'e.g., Comment, Share experience, Visit website'
            }
        ]
    },
    
    // Email Marketing Templates
    {
        name: 'Email Subject Line Generator',
        desc: 'Create high-converting email subject lines that boost open rates',
        category: 'Email',
        icon: 'https://cdn-icons-png.flaticon.com/128/2099/2099199.png',
        aiPrompt: 'Generate 10 compelling email subject lines that will maximize open rates. Include a mix of curiosity-driven, benefit-driven, and urgency-based subject lines. Format in rich text editor style.',
        slug: 'generate-email-subject',
        form: [
            {
                label: 'Email Purpose',
                field: 'input',
                name: 'purpose',
                required: true,
                placeholder: 'e.g., Newsletter, Promotion, Welcome Email'
            },
            {
                label: 'Target Audience',
                field: 'input',
                name: 'audience',
                required: true,
                placeholder: 'Who will receive this email?'
            },
            {
                label: 'Key Benefit or Offer',
                field: 'textarea',
                name: 'offer',
                placeholder: 'What\'s the main value proposition or offer?'
            },
            {
                label: 'Brand Voice',
                field: 'input',
                name: 'voice',
                placeholder: 'e.g., Professional, Friendly, Urgent'
            }
        ]
    },
    {
        name: 'Email Newsletter Template',
        desc: 'Generate engaging email newsletter content that keeps subscribers informed',
        category: 'Email',
        icon: 'https://cdn-icons-png.flaticon.com/128/2875/2875427.png',
        aiPrompt: 'Generate a complete email newsletter with sections for introduction, main content, featured items, and call-to-action. Include appropriate headings and maintain consistent tone. Format in rich text editor style.',
        slug: 'generate-email-newsletter',
        form: [
            {
                label: 'Newsletter Topic',
                field: 'input',
                name: 'topic',
                required: true,
                placeholder: 'Main focus of this newsletter'
            },
            {
                label: 'Industry/Niche',
                field: 'input',
                name: 'industry',
                required: true,
                placeholder: 'e.g., Tech, Fashion, Finance'
            },
            {
                label: 'Key Updates or News',
                field: 'textarea',
                name: 'updates',
                placeholder: 'List any specific updates to include'
            },
            {
                label: 'Call-to-Action',
                field: 'input',
                name: 'cta',
                placeholder: 'What action do you want readers to take?'
            },
            {
                label: 'Tone',
                field: 'input',
                name: 'tone',
                placeholder: 'e.g., Professional, Casual, Enthusiastic'
            }
        ]
    },
    {
        name: 'Promotional Email Generator',
        desc: 'Create compelling promotional emails that drive conversions and sales',
        category: 'Email',
        icon: 'https://cdn-icons-png.flaticon.com/128/1989/1989125.png',
        aiPrompt: 'Generate a persuasive promotional email with attention-grabbing headline, compelling body copy, and strong call-to-action. Emphasize benefits and create urgency. Format in rich text editor style.',
        slug: 'generate-promo-email',
        form: [
            {
                label: 'Product/Service Name',
                field: 'input',
                name: 'product',
                required: true,
                placeholder: 'What are you promoting?'
            },
            {
                label: 'Main Benefit',
                field: 'textarea',
                name: 'benefit',
                required: true,
                placeholder: 'What\'s the primary benefit for customers?'
            },
            {
                label: 'Special Offer Details',
                field: 'textarea',
                name: 'offer',
                placeholder: 'Discount, limited time offer, etc.'
            },
            {
                label: 'Call-to-Action',
                field: 'input',
                name: 'cta',
                placeholder: 'e.g., Shop Now, Learn More, Get Started'
            },
            {
                label: 'Urgency Factor',
                field: 'input',
                name: 'urgency',
                placeholder: 'e.g., Limited time, Limited quantity, Deadline'
            }
        ]
    },
    
    // Additional SEO Templates
    {
        name: 'SEO Title Tag Generator',
        desc: 'Create optimized page titles that rank well and drive clicks',
        category: 'SEO',
        icon: 'https://cdn-icons-png.flaticon.com/128/2920/2920277.png',
        aiPrompt: 'Generate 5 SEO-optimized title tags (50-60 characters each) that include the target keyword, communicate value, and encourage clicks. Format in rich text editor style.',
        slug: 'generate-seo-title',
        form: [
            {
                label: 'Page Content',
                field: 'textarea',
                name: 'content',
                required: true,
                placeholder: 'Brief description of the page content'
            },
            {
                label: 'Primary Keyword',
                field: 'input',
                name: 'keyword',
                required: true,
                placeholder: 'Main keyword to target'
            },
            {
                label: 'Secondary Keywords',
                field: 'input',
                name: 'secondary',
                placeholder: 'Additional keywords (comma separated)'
            },
            {
                label: 'Brand Name',
                field: 'input',
                name: 'brand',
                placeholder: 'Your brand name to include'
            }
        ]
    },
    {
        name: 'Keyword Research Assistant',
        desc: 'Generate relevant keyword ideas for your content and SEO strategy',
        category: 'SEO',
        icon: 'https://cdn-icons-png.flaticon.com/128/2645/2645250.png',
        aiPrompt: 'Generate a comprehensive list of keyword ideas organized by search intent (informational, navigational, commercial, transactional). Include long-tail variations and related terms. Format in rich text editor style.',
        slug: 'generate-keywords',
        form: [
            {
                label: 'Main Topic',
                field: 'input',
                name: 'topic',
                required: true,
                placeholder: 'Primary topic or product'
            },
            {
                label: 'Industry/Niche',
                field: 'input',
                name: 'industry',
                required: true,
                placeholder: 'Your specific industry or niche'
            },
            {
                label: 'Target Audience',
                field: 'textarea',
                name: 'audience',
                placeholder: 'Who are you trying to reach?'
            },
            {
                label: 'Content Type',
                field: 'input',
                name: 'contentType',
                placeholder: 'e.g., Blog post, Product page, Landing page'
            }
        ]
    },
    {
        name: 'SEO Content Brief Generator',
        desc: 'Create comprehensive SEO content briefs for writers and content creators',
        category: 'SEO',
        icon: 'https://cdn-icons-png.flaticon.com/128/2541/2541988.png',
        aiPrompt: 'Generate a detailed SEO content brief with target keywords, suggested headings, word count recommendations, internal linking opportunities, and competitor insights. Format in rich text editor style.',
        slug: 'generate-seo-brief',
        form: [
            {
                label: 'Content Topic',
                field: 'input',
                name: 'topic',
                required: true,
                placeholder: 'Main topic of the content'
            },
            {
                label: 'Primary Keyword',
                field: 'input',
                name: 'keyword',
                required: true,
                placeholder: 'Main keyword to target'
            },
            {
                label: 'Secondary Keywords',
                field: 'textarea',
                name: 'secondary',
                placeholder: 'List additional keywords (one per line)'
            },
            {
                label: 'Target Word Count',
                field: 'input',
                name: 'wordCount',
                type: 'number',
                placeholder: 'e.g., 1500'
            },
            {
                label: 'Competitor URLs',
                field: 'textarea',
                name: 'competitors',
                placeholder: 'URLs of top-ranking competitors (one per line)'
            }
        ]
    }
];

// @route   GET /api/templates
// @desc    Get all templates
// @access  Public
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: templates.length,
        templates
    });
});

// @route   GET /api/templates/:slug
// @desc    Get template by slug
// @access  Public
router.get('/:slug', (req, res) => {
    const template = templates.find(t => t.slug === req.params.slug);
    
    if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
    }
    
    res.json({
        success: true,
        template
    });
});

module.exports = router;
