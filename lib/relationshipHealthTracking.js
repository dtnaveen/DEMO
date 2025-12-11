/**
 * Relationship Health Tracking
 * Compatibility over time, relationship milestones, success metrics
 */

/**
 * Track relationship health over time
 */
export class RelationshipHealthTracker {
  constructor(userId1, userId2) {
    this.userId1 = userId1;
    this.userId2 = userId2;
    this.relationshipId = `${userId1}_${userId2}`;
  }

  /**
   * Record relationship snapshot
   * @param {Object} data - Relationship data
   * @returns {Object} Snapshot
   */
  recordSnapshot(data) {
    const snapshot = {
      relationshipId: this.relationshipId,
      timestamp: new Date().toISOString(),
      matchScore: data.matchScore || 0,
      messageCount: data.messageCount || 0,
      responseTime: data.avgResponseTime || 0,
      conversationQuality: data.conversationQuality || 0,
      sharedInterests: data.sharedInterests || [],
      milestones: data.milestones || [],
      notes: data.notes || '',
    };

    // Save snapshot
    const snapshots = this.getSnapshots();
    snapshots.push(snapshot);
    localStorage.setItem(`relationship_snapshots_${this.relationshipId}`, JSON.stringify(snapshots));

    return snapshot;
  }

  /**
   * Get all snapshots
   * @returns {Array} Snapshots
   */
  getSnapshots() {
    return JSON.parse(localStorage.getItem(`relationship_snapshots_${this.relationshipId}`) || '[]');
  }

  /**
   * Analyze relationship health over time
   * @returns {Object} Health analysis
   */
  analyzeHealth() {
    const snapshots = this.getSnapshots();
    
    if (snapshots.length === 0) {
      return {
        status: 'insufficient_data',
        message: 'Not enough data to analyze relationship health',
      };
    }

    const analysis = {
      trend: this.calculateTrend(snapshots),
      currentHealth: this.calculateCurrentHealth(snapshots[snapshots.length - 1]),
      milestones: this.getMilestones(snapshots),
      recommendations: this.generateRecommendations(snapshots),
      timeline: this.generateTimeline(snapshots),
    };

    return analysis;
  }

  /**
   * Calculate relationship trend
   * @param {Array} snapshots - Relationship snapshots
   * @returns {Object} Trend analysis
   */
  calculateTrend(snapshots) {
    if (snapshots.length < 2) {
      return { direction: 'stable', change: 0 };
    }

    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];

    const scoreChange = last.matchScore - first.matchScore;
    const qualityChange = last.conversationQuality - first.conversationQuality;

    const overallChange = (scoreChange + qualityChange) / 2;

    return {
      direction: overallChange > 5 ? 'improving' : overallChange < -5 ? 'declining' : 'stable',
      change: Math.round(overallChange),
      scoreChange: Math.round(scoreChange),
      qualityChange: Math.round(qualityChange),
    };
  }

  /**
   * Calculate current health score
   * @param {Object} latestSnapshot - Latest snapshot
   * @returns {Object} Health score
   */
  calculateCurrentHealth(latestSnapshot) {
    const factors = {
      matchScore: latestSnapshot.matchScore || 0,
      conversationQuality: latestSnapshot.conversationQuality || 0,
      engagement: this.calculateEngagement(latestSnapshot),
      communication: this.calculateCommunication(latestSnapshot),
    };

    const healthScore = Math.round(
      (factors.matchScore * 0.3) +
      (factors.conversationQuality * 0.3) +
      (factors.engagement * 0.2) +
      (factors.communication * 0.2)
    );

    return {
      score: healthScore,
      category: healthScore >= 75 ? 'excellent' :
                healthScore >= 60 ? 'good' :
                healthScore >= 45 ? 'fair' : 'needs_attention',
      factors,
    };
  }

  /**
   * Calculate engagement score
   * @param {Object} snapshot - Snapshot
   * @returns {number} Engagement score
   */
  calculateEngagement(snapshot) {
    // Based on message count and frequency
    const messageCount = snapshot.messageCount || 0;
    return Math.min(messageCount / 10 * 100, 100);
  }

  /**
   * Calculate communication score
   * @param {Object} snapshot - Snapshot
   * @returns {number} Communication score
   */
  calculateCommunication(snapshot) {
    // Based on response time and conversation quality
    const responseTime = snapshot.responseTime || 24; // hours
    const responseScore = responseTime < 1 ? 100 : responseTime < 6 ? 80 : responseTime < 12 ? 60 : 40;
    
    return Math.round((responseScore + snapshot.conversationQuality) / 2);
  }

  /**
   * Get relationship milestones
   * @param {Array} snapshots - Snapshots
   * @returns {Array} Milestones
   */
  getMilestones(snapshots) {
    const milestones = [];

    // First message
    if (snapshots.length > 0 && snapshots[0].messageCount > 0) {
      milestones.push({
        type: 'first_message',
        date: snapshots[0].timestamp,
        description: 'First message sent',
      });
    }

    // 10 messages
    const tenMessages = snapshots.find(s => s.messageCount >= 10);
    if (tenMessages) {
      milestones.push({
        type: '10_messages',
        date: tenMessages.timestamp,
        description: '10 messages exchanged',
      });
    }

    // 50 messages
    const fiftyMessages = snapshots.find(s => s.messageCount >= 50);
    if (fiftyMessages) {
      milestones.push({
        type: '50_messages',
        date: fiftyMessages.timestamp,
        description: '50 messages exchanged',
      });
    }

    // High match score
    const highScore = snapshots.find(s => s.matchScore >= 80);
    if (highScore) {
      milestones.push({
        type: 'high_compatibility',
        date: highScore.timestamp,
        description: 'High compatibility achieved',
      });
    }

    return milestones;
  }

  /**
   * Generate recommendations
   * @param {Array} snapshots - Snapshots
   * @returns {Array} Recommendations
   */
  generateRecommendations(snapshots) {
    const recommendations = [];
    const latest = snapshots[snapshots.length - 1];

    if (latest.conversationQuality < 60) {
      recommendations.push({
        type: 'communication',
        message: 'Focus on improving conversation quality by asking deeper questions',
        priority: 'high',
      });
    }

    if (latest.responseTime > 12) {
      recommendations.push({
        type: 'response_time',
        message: 'Try to respond more quickly to maintain engagement',
        priority: 'medium',
      });
    }

    if (snapshots.length > 1) {
      const trend = this.calculateTrend(snapshots);
      if (trend.direction === 'declining') {
        recommendations.push({
          type: 'trend',
          message: 'Relationship health is declining. Consider having an open conversation.',
          priority: 'high',
        });
      }
    }

    return recommendations;
  }

  /**
   * Generate relationship timeline
   * @param {Array} snapshots - Snapshots
   * @returns {Array} Timeline events
   */
  generateTimeline(snapshots) {
    return snapshots.map((snapshot, index) => ({
      date: snapshot.timestamp,
      matchScore: snapshot.matchScore,
      messageCount: snapshot.messageCount,
      conversationQuality: snapshot.conversationQuality,
      milestone: snapshot.milestones.length > 0 ? snapshot.milestones[0] : null,
    }));
  }

  /**
   * Add milestone
   * @param {string} type - Milestone type
   * @param {string} description - Milestone description
   * @returns {Object} Milestone
   */
  addMilestone(type, description) {
    const milestone = {
      type,
      description,
      timestamp: new Date().toISOString(),
    };

    const snapshots = this.getSnapshots();
    if (snapshots.length > 0) {
      const latest = snapshots[snapshots.length - 1];
      if (!latest.milestones) {
        latest.milestones = [];
      }
      latest.milestones.push(milestone);
      localStorage.setItem(`relationship_snapshots_${this.relationshipId}`, JSON.stringify(snapshots));
    }

    return milestone;
  }
}

/**
 * Get relationship health for match
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {Object} Relationship health
 */
export function getRelationshipHealth(userId1, userId2) {
  const tracker = new RelationshipHealthTracker(userId1, userId2);
  return tracker.analyzeHealth();
}

