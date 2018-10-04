export const raw =
{
  "git": "ef75ae17adece055960d010964602fef878b1958",
  "args": {
    "username": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "String"
        }
      ]
    },
    "password": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "String"
        }
      ]
    },
    "nogui": {
      "_name": "Boolean"
    },
    "selenium_local_session": {
      "_name": "Boolean"
    },
    "use_firefox": {
      "_name": "Boolean"
    },
    "browser_profile_path": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "String"
        }
      ]
    },
    "page_delay": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 0
      }
    },
    "show_logs": {
      "_name": "Union",
      "_options": [
        {
          "_name": "Boolean"
        },
        {
          "_name": "None"
        }
      ]
    },
    "headless_browser": {
      "_name": "Boolean"
    },
    "proxy_address": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "String"
        }
      ]
    },
    "proxy_chrome_extension": {
      "_name": "None"
    },
    "proxy_port": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 1,
        "_max": 65535
      }
    },
    "bypass_suspicious_attempt": {
      "_name": "Boolean"
    },
    "multi_logs": {
      "_name": "Boolean"
    },
    "selenium_url": {
      "_name": "String"
    },
    "percentage": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 0,
        "_max": 100
      }
    },
    "enabled": {
      "_name": "Union",
      "_options": [
        {
          "_name": "Boolean"
        },
        {
          "_name": "None"
        }
      ]
    },
    "comments": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "media": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Union",
          "_options": [
            "Photo",
            "Video"
          ]
        }
      ]
    },
    "times": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 1
      }
    },
    "tags": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "amount": {
      "_name": "Union",
      "_options": [
        {
          "_name": "Number",
          "_constraints": {
            "_step": 1,
            "_min": 1
          }
        },
        {
          "_name": "None"
        }
      ]
    },
    "randomize": {
      "_name": "Boolean"
    },
    "users": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "words": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "friends": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "option": {
      "_name": "Boolean"
    },
    "api_key": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "String"
        }
      ]
    },
    "full_match": {
      "_name": "Boolean"
    },
    "limit": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 1
      }
    },
    "sort": {
      "_name": "Union",
      "_options": [
        "top",
        "random"
      ]
    },
    "log_tags": {
      "_name": "Boolean"
    },
    "tags_skip": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "comment": {
      "_name": "Boolean"
    },
    "usernames": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "daysold": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 0
      }
    },
    "max_pic": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 1
      }
    },
    "sleep_delay": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 0
      }
    },
    "interact": {
      "_name": "Boolean"
    },
    "photos_grab_amount": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 1
      }
    },
    "follow_likers_per_photo": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 0
      }
    },
    "followlist": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "potency_ratio": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Number",
          "_constraints": {
            "_step": 0.01,
            "_min": 0
          }
        }
      ]
    },
    "delimit_by_numbers": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Boolean"
        }
      ]
    },
    "max_followers": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Number",
          "_constraints": {
            "_step": 1,
            "_min": 1
          }
        }
      ]
    },
    "max_following": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Number",
          "_constraints": {
            "_step": 1,
            "_min": 1
          }
        }
      ]
    },
    "min_followers": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Number",
          "_constraints": {
            "_step": 1,
            "_min": 0
          }
        }
      ]
    },
    "min_following": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Number",
          "_constraints": {
            "_step": 1,
            "_min": 0
          }
        }
      ]
    },
    "max": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Number",
          "_constraints": {
            "_step": 1,
            "_min": 1
          }
        }
      ]
    },
    "min": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Number",
          "_constraints": {
            "_step": 1,
            "_min": 0
          }
        }
      ]
    },
    "locations": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Array",
          "_subType": "String"
        }
      ]
    },
    "skip_top_posts": {
      "_name": "Boolean"
    },
    "use_smart_hashtags": {
      "_name": "Boolean"
    },
    "url": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "String"
        }
      ]
    },
    "customList": {
      "_name": "Tuple",
      "_subTypes": [
        {
          "_name": "Boolean"
        },
        {
          "_name": "Array",
          "_subType": "String"
        },
        {
          "_name": "Union",
          "_options": [
            "all",
            "nonfollowers"
          ]
        }
      ]
    },
    "InstapyFollowed": {
      "_name": "Tuple",
      "_subTypes": [
        {
          "_name": "Boolean"
        },
        {
          "_name": "Union",
          "_options": [
            "all",
            "nonfollowers"
          ]
        }
      ]
    },
    "nonFollowers": {
      "_name": "Boolean"
    },
    "allFollowing": {
      "_name": "Boolean"
    },
    "style": {
      "_name": "Union",
      "_options": [
        "FIFO",
        "LIFO",
        "RANDOM"
      ]
    },
    "unfollow_after": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "Number",
          "_constraints": {
            "_step": 1,
            "_min": 0
          }
        }
      ]
    },
    "unfollow": {
      "_name": "Boolean"
    },
    "posts": {
      "_name": "Number",
      "_constraints": {
        "_step": 1,
        "_min": 1
      }
    },
    "boundary": {
      "_name": "Number",
      "_constraints": {}
    },
    "campaign": {
      "_name": "Union",
      "_options": [
        {
          "_name": "None"
        },
        {
          "_name": "String"
        }
      ]
    },
    "live_match": {
      "_name": "Boolean"
    },
    "store_locally": {
      "_name": "Boolean"
    },
    "compare_by": {
      "_name": "Union",
      "_options": [
        "latest",
        "earliest",
        "day",
        "month",
        "year"
      ]
    },
    "compare_track": {
      "_name": "Union",
      "_options": [
        "first",
        "median",
        "last"
      ]
    },
    "print_out": {
      "_name": "Boolean"
    },
    "urls": {
      "_name": "Array",
      "_subType": "String"
    }
  },
  "methods": {
    "__init__": {
      "username": null,
      "password": null,
      "nogui": false,
      "selenium_local_session": true,
      "use_firefox": false,
      "browser_profile_path": null,
      "page_delay": 25,
      "show_logs": true,
      "headless_browser": false,
      "proxy_address": null,
      "proxy_chrome_extension": null,
      "proxy_port": null,
      "bypass_suspicious_attempt": false,
      "multi_logs": false
    },
    "get_instapy_logger": {
      "show_logs": null
    },
    "set_selenium_local_session": {},
    "set_selenium_remote_session": {
      "selenium_url": ""
    },
    "login": {},
    "set_sleep_reduce": {
      "percentage": null
    },
    "set_do_comment": {
      "enabled": false,
      "percentage": 0
    },
    "set_comments": {
      "comments": null,
      "media": null
    },
    "set_do_follow": {
      "enabled": false,
      "percentage": 0,
      "times": 1
    },
    "set_do_like": {
      "enabled": false,
      "percentage": 0
    },
    "set_dont_like": {
      "tags": null
    },
    "set_mandatory_words": {
      "tags": null
    },
    "set_user_interact": {
      "amount": 10,
      "percentage": 100,
      "randomize": false,
      "media": null
    },
    "set_ignore_users": {
      "users": null
    },
    "set_ignore_if_contains": {
      "words": null
    },
    "set_dont_include": {
      "friends": null
    },
    "set_switch_language": {
      "option": true
    },
    "set_use_clarifai": {
      "enabled": false,
      "api_key": null,
      "full_match": false
    },
    "set_smart_hashtags": {
      "tags": null,
      "limit": 3,
      "sort": "top",
      "log_tags": true
    },
    "clarifai_check_img_for": {
      "tags": null,
      "tags_skip": null,
      "comment": false,
      "comments": null
    },
    "follow_commenters": {
      "usernames": null,
      "amount": 10,
      "daysold": 365,
      "max_pic": 50,
      "sleep_delay": 600,
      "interact": false
    },
    "follow_likers ": {
      "usernames": null,
      "photos_grab_amount": 3,
      "follow_likers_per_photo": 3,
      "randomize": true,
      "sleep_delay": 600,
      "interact": false
    },
    "follow_by_list": {
      "followlist": null,
      "times": 1,
      "sleep_delay": 600,
      "interact": false
    },
    "set_relationship_bounds ": {
      "enabled": null,
      "potency_ratio": null,
      "delimit_by_numbers": null,
      "max_followers": null,
      "max_following": null,
      "min_followers": null,
      "min_following": null
    },
    "set_delimit_liking": {
      "enabled": null,
      "max": null,
      "min": null
    },
    "set_delimit_commenting": {
      "enabled": false,
      "max": null,
      "min": null
    },
    "set_simulation": {
      "enabled": true,
      "percentage": 100
    },
    "like_by_locations": {
      "locations": null,
      "amount": 50,
      "media": null,
      "skip_top_posts": true
    },
    "comment_by_locations": {
      "locations": null,
      "amount": 50,
      "media": null,
      "skip_top_posts": true
    },
    "like_by_tags": {
      "tags": null,
      "amount": 50,
      "skip_top_posts": true,
      "use_smart_hashtags": false,
      "interact": false,
      "randomize": false,
      "media": null
    },
    "like_by_users": {
      "usernames": null,
      "amount": 10,
      "randomize": false,
      "media": null
    },
    "interact_by_users": {
      "usernames": null,
      "amount": 10,
      "randomize": false,
      "media": null
    },
    "like_from_image": {
      "url": null,
      "amount": 50,
      "media": null
    },
    "interact_user_followers": {
      "usernames": null,
      "amount": 10,
      "randomize": false
    },
    "interact_user_following": {
      "usernames": null,
      "amount": 10,
      "randomize": false
    },
    "follow_user_followers": {
      "usernames": null,
      "amount": 10,
      "randomize": false,
      "interact": false,
      "sleep_delay": 600
    },
    "follow_user_following": {
      "usernames": null,
      "amount": 10,
      "randomize": false,
      "interact": false,
      "sleep_delay": 600
    },
    "unfollow_users": {
      "amount": 10,
      "customList": [
        false,
        [],
        "all"
      ],
      "InstapyFollowed": [
        false,
        "all"
      ],
      "nonFollowers": false,
      "allFollowing": false,
      "style": "FIFO",
      "unfollow_after": null,
      "sleep_delay": 600
    },
    "like_by_feed": {
      "amount": 50,
      "randomize": false,
      "unfollow": false,
      "interact": false
    },
    "set_dont_unfollow_active_users": {
      "enabled": false,
      "posts": 4,
      "boundary": 500
    },
    "set_blacklist": {
      "enabled": null,
      "campaign": null
    },
    "grab_followers": {
      "username": null,
      "amount": null,
      "live_match": false,
      "store_locally": true
    },
    "grab_following": {
      "username": null,
      "amount": null,
      "live_match": false,
      "store_locally": true
    },
    "pick_unfollowers": {
      "username": null,
      "compare_by": "latest",
      "compare_track": "first",
      "live_match": false,
      "store_locally": true,
      "print_out": true
    },
    "pick_nonfollowers": {
      "username": null,
      "live_match": false,
      "store_locally": true
    },
    "pick_fans": {
      "username": null,
      "live_match": false,
      "store_locally": true
    },
    "pick_mutual_following": {
      "username": null,
      "live_match": false,
      "store_locally": true
    },
    "end": {},
    "follow_by_tags": {
      "tags": null,
      "amount": 50,
      "skip_top_posts": true,
      "use_smart_hashtags": false,
      "randomize": false,
      "media": null
    },
    "interact_by_URL": {
      "urls": [],
      "randomize": false,
      "interact": false
    }
  }
}
