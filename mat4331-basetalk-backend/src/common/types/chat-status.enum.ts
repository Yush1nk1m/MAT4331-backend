export enum ChatStatus {
  ACCEPT = 'accepted', // filtered and not to be predicted as bad words
  FILTERED = 'filtered', // filtered and to be predicted as bad words
  NONE = 'none', // not yet filtered
}
