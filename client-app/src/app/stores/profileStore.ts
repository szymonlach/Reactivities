import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {

    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;


    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) { return store.userStore.user.username === this.profile.username; }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.getProfile(username);
            runInAction(() => {
                this.profile = profile;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => { this.loadingProfile = false; })
        }
    }

    editProfile = async (profile: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.editProfile(profile);
            runInAction(() => {
                if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                this.profile = { ...this.profile, ...profile as Profile }
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    uploadPhoto = async (photo: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Photos.uploadPhoto(photo);
            const responsePhoto = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(responsePhoto);
                    if (responsePhoto.isMain && store.userStore.user) {
                        store.userStore.setImage(responsePhoto.url);
                        this.profile.image = responsePhoto.url;
                    }
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => { this.uploading = false; })
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Photos.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            store.activityStore.activityRegistry.forEach(activity => {
                if (activity.host?.username === this.profile?.username) {
                    activity.host!.image = photo.url;
                }
                activity.attendees.forEach(attendee => {
                    if (attendee.username === this.profile?.username) {
                        attendee.image = photo.url;
                    }
                })
            })
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(x => x.isMain)!.isMain = false;
                    this.profile.photos.find(x => x.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Photos.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(x => x.id !== photo.id);
                }
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;

        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }

                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                }

                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => { 
                this.followings = followings;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingFollowings = false)
        }
    }

}