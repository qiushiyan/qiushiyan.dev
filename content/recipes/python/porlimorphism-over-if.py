"""
title: Polymorphism over if/else
"""

# example from https://www.youtube.com/watch?v=P0kfKqMHioQ


def get_github_events(github_username):
    return []


def perform(github_username):
    user_events = GitHubUserEvents(github_username)
    return user_events.generate_summary_text()


class GitHubUserEvents:
    def __init__(self, user):
        events = get_github_events(user)
        self.user = user
        self.event_types = self.classify_events(events)

    @staticmethod
    def classify_events(events):
        event_types = [Commits(), Stars()]
        for event in events:
            for event_type in event_types:
                if event_type.matches_event(event):
                    event_type.append(event)
        return event_types

    def generate_summary_text(self):
        text = f"<@{self.user}> summary\n"
        for event_type in self.event_types:
            if len(event_type) > 0:
                text += event_type.generate_summary_text()
        return text


class EventList:
    def __init__(self):
        self.events = []

    def __len__(self):
        return len(self.events)

    def append(self, item):
        self.events.append(item)

    @staticmethod
    def matches_event(event):
        raise NotImplementedError

    def generate_summary_text(self):
        raise NotImplementedError


class Commits(EventList):
    @staticmethod
    def matches_event(event):
        return event["type"] == "PushEvent"

    def generate_summary_text(self):
        repos = list(set([event["repo"]["name"] for event in self.events]))
        commit_count = sum([len(event["payload"]["commits"]) for event in self.events])
        return (
            f">:arrow_up: {commit_count} commit(s) to "
            f"{len(repos)} repo(s): {', '.join(repos)}\n"
        )


class Stars(EventList):
    @staticmethod
    def matches_event(event):
        return event["type"] == "WatchEvent"

    def generate_summary_text(self):
        repos = list(set([event["repo"]["name"] for event in self.events]))
        return f">:star: {len(repos)} repo(s): {', '.join(repos)}\n"
