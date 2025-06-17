'use client';

import { useState } from 'react';
import { Recommendation } from '@/types';
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Settings, 
  X, 
  CheckCircle,
  ExternalLink,
  Info,
  Zap
} from 'lucide-react';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  onDismiss?: (recommendationId: string) => void;
  onAction?: (recommendationId: string, action: string) => void;
}

export default function RecommendationsPanel({ 
  recommendations, 
  onDismiss,
  onAction 
}: RecommendationsPanelProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'deadline':
        return { icon: Clock, color: 'text-red-500', bg: 'bg-red-50' };
      case 'productivity':
        return { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'workflow':
        return { icon: Settings, color: 'text-purple-500', bg: 'bg-purple-50' };
      case 'priority':
        return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50' };
      default:
        return { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  const getImpactBadge = (impact: Recommendation['impact']) => {
    switch (impact) {
      case 'high':
        return { label: 'High Impact', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' };
      case 'medium':
        return { label: 'Medium Impact', color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' };
      case 'low':
        return { label: 'Low Impact', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' };
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(Array.from(prev).concat(id)));
    onDismiss?.(id);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(Array.from(prev));
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAction = (id: string, action: string) => {
    onAction?.(id, action);
  };

  const visibleRecommendations = recommendations.filter(rec => !dismissedIds.has(rec.id));
  const highPriorityRecs = visibleRecommendations.filter(rec => rec.impact === 'high');
  const mediumPriorityRecs = visibleRecommendations.filter(rec => rec.impact === 'medium');
  const lowPriorityRecs = visibleRecommendations.filter(rec => rec.impact === 'low');

  if (visibleRecommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600">
            No urgent recommendations at this time. Your team is performing well.
          </p>
        </div>
      </div>
    );
  }

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
    const { icon: Icon, color, bg } = getRecommendationIcon(recommendation.type);
    const impact = getImpactBadge(recommendation.impact);
    const isExpanded = expandedIds.has(recommendation.id);

    return (
      <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
        recommendation.impact === 'high' 
          ? 'border-red-200 bg-red-50' 
          : recommendation.impact === 'medium'
            ? 'border-yellow-200 bg-yellow-50'
            : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`p-2 rounded-lg ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-gray-900 truncate">{recommendation.title}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${impact.color} ${impact.bg} ${impact.border} border`}>
                  {impact.label}
                </div>
                {recommendation.confidence && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Zap className="w-3 h-3" />
                    <span>{recommendation.confidence}%</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
              
              {isExpanded && (
                <div className="space-y-3">
                  {recommendation.suggestedAction && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-blue-900 mb-1">Suggested Action</h5>
                      <p className="text-sm text-blue-800">{recommendation.suggestedAction}</p>
                    </div>
                  )}
                  
                  {recommendation.relatedTasks && recommendation.relatedTasks.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Related Tasks</h5>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.relatedTasks.map(taskId => (
                          <span
                            key={taskId}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                          >
                            {taskId}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Created: {new Date(recommendation.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={() => handleToggleExpand(recommendation.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isExpanded ? 'Show Less' : 'View Details'}
                </button>
                
                {recommendation.actionable && recommendation.suggestedAction && (
                  <button
                    onClick={() => handleAction(recommendation.id, 'implement')}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Take Action
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleDismiss(recommendation.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            title="Dismiss recommendation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
        <div className="text-sm text-gray-500">
          {visibleRecommendations.length} recommendation{visibleRecommendations.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-6">
        {highPriorityRecs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              High Priority ({highPriorityRecs.length})
            </h4>
            <div className="space-y-3">
              {highPriorityRecs.map(rec => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}

        {mediumPriorityRecs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-yellow-700 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Medium Priority ({mediumPriorityRecs.length})
            </h4>
            <div className="space-y-3">
              {mediumPriorityRecs.map(rec => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}

        {lowPriorityRecs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Low Priority ({lowPriorityRecs.length})
            </h4>
            <div className="space-y-3">
              {lowPriorityRecs.map(rec => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Recommendations are generated using AI analysis of your task patterns and team performance.
          Confidence scores indicate the reliability of each suggestion.
        </p>
      </div>
    </div>
  );
}