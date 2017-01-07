import {inject, useView} from 'aurelia-framework';

export class Faq {
    title = "Frequently Asked Questions";

    faqs = [
        {
            question: "What is HomeConnect ?",
            answer: "HomeConnect is a home automation system built by Gulfaraz Yasin because the fat in his body has taken control of his body and mind.",
            link: {}
        },
        {
            question: "What is Home Automation ?",
            answer: "Click the following link to discover home automation",
            link: {
                url: "https://en.wikipedia.org/wiki/Home_automation",
                title: "Home Automation"
            }
        },
        {
            question: "What to eat ?",
            answer: "Follow the link below",
            link: {
                url: "http://www.reciperoulette.tv/",
                title: "Recipe Roulette"
            }
        }
    ];
}
